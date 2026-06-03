import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../services/mail.service.js";

dotenv.config();

const getJwtSecret = () => process.env.JWT_SECRET || process.env.SECRET_KEY;
const getAppUrl = () => process.env.BACKEND_URL || "http://localhost:3000";
const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const sanitizeUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  verified: user.verified,
  profile: user.profile,
});

export const registerController = async (req, res, next) => {
  try {
    console.log("hii")
    const { fullname, email, phoneNumber, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      verified: false,
      profile: {
        profilePhoto,
      },
    });

    const verificationToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      getJwtSecret(),
      { expiresIn: "1d" }
    );

    const verificationUrl = `${getAppUrl()}/api/auth/verify-email?token=${verificationToken}`;

    let emailSent = true;
    try {
      const res = await sendEmail({
        to: email,
        subject: "Verify your account",
        html: `
          <p>Hi ${fullname},</p>
          <p>Your account was created successfully. Please verify your email address to activate your account.</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
          <p>If you did not create this account, you can ignore this email.</p>
        `,
      });
      console.log(res)
    } catch (emailError) {
      emailSent = false;
      console.error("Verification email failed:", emailError.message);
    }

    const response = {
      message: emailSent
        ? "Registration successful. Please verify your email before logging in."
        : "Registration successful, but verification email failed. Use the verification link in response (development only).",
      success: true,
      emailSent,
      user: sanitizeUser(newUser),
    };

    if (!emailSent && process.env.NODE_ENV !== "production") {
      response.verificationUrl = verificationUrl;
    }

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    return res.status(200).send(`
      <html>
        <head>
          <title>Email Verified</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 40px; color: #0f172a; }
            .card { max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12); }
            h1 { margin-top: 0; }
            a { color: #dc2626; text-decoration: none; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Email verified</h1>
            <p>Your account is now active. You can close this tab and go back to the login page.</p>
            <p><a href="${getFrontendUrl()}/login">Go to Login</a></p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        fullname: user.fullname,
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .cookie("token", token, buildCookieOptions())
      .json({
        message: "Login successful",
        success: true,
        user: sanitizeUser(user),
      });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "lax" })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    next(error);
  }
};