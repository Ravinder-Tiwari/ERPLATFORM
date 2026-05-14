import { User } from "../models/user.model.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const sanitizeFilename = (filename = "") =>
    filename.replace(/[\\/:*?"<>|]/g, "-").trim();

const getFallbackResumeName = (user, mimeType = "") => {
    const extensionMap = {
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
    };

    const baseName =
        user?.fullname?.trim()?.replace(/\s+/g, "-").toLowerCase() || "resume";
    const extension = extensionMap[mimeType] || "pdf";

    return `${baseName}.${extension}`;
};

const getResumeResponseHeaders = (user, responseHeaders = {}, download = false) => {
    const originalName =
        user.profile.resumeOriginalName ||
        getFallbackResumeName(user, user.profile.resumeMimeType);
    const filename = sanitizeFilename(originalName) || "resume.pdf";
    const contentType =
        user.profile.resumeMimeType ||
        responseHeaders["content-type"] ||
        "application/octet-stream";
    const contentLength = responseHeaders["content-length"];
    const dispositionType = download ? "attachment" : "inline";

    return {
        filename,
        contentType,
        contentLength,
        contentDisposition: `${dispositionType}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    };
};

// ================= REGISTER =================

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const file = req.file;
        let cloudResponse = null;

        // Upload profile photo if provided
        if (file) {
            const fileUri = getDataUri(file);

            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "profile_photos",
                resource_type: "image",
                type: "upload"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url || ""
            }
        });

        // Create token
        const tokenData = {
            userId: newUser._id
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Send response
        return res
            .status(201)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                sameSite: "none",
                secure: true
            })
            .json({
                message: "Account created successfully.",
                success: true,
                user: {
                    _id: newUser._id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    role: newUser.role,
                    profile: newUser.profile
                }
            });

    } catch (error) {
        console.error("Registration Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// ================= LOGIN =================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password",
                success: false
            });
        }

        // Find user
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Create token
        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Sanitize user
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                sameSite: "none",
                secure: true
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                success: true,
                user
            });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// ================= LOGOUT =================

export const logout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({
                message: "Logged out successfully.",
                success: true
            });

    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// ================= UPDATE PROFILE =================

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let cloudResponse = null;

        // Upload Resume
        if (file) {

            // Validate file type
            if (!ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
                return res.status(400).json({
                    message: "Only PDF, DOC, and DOCX resumes are allowed.",
                    success: false
                });
            }

            const fileUri = getDataUri(file);

            // Upload to Cloudinary
            cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    resource_type: "auto", // allow PDF to be viewable in browser
                    folder: "resumes",
                    type: "upload",
                }
            );
        }

        // Convert skills into array
        let skillsArray = [];

        if (skills) {
            skillsArray = skills.split(",");
        }

        // Get user
        const userId = req.id;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update fields
        if (fullname) user.fullname = fullname;

        if (email) user.email = email;

        if (phoneNumber) user.phoneNumber = phoneNumber;

        if (bio) user.profile.bio = bio;

        if (skills) user.profile.skills = skillsArray;

        // Save resume data
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumePublicId = cloudResponse.public_id;
            user.profile.resumeMimeType = file.mimetype;
            user.profile.resumeOriginalName = file.originalname;
        }

        // Save user
        await user.save();

        // Send updated response
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });
    }
};

// ================= DOWNLOAD RESUME =================

export const downloadResume = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select(
            "fullname profile.resume profile.resumeMimeType profile.resumeOriginalName"
        );

        if (!user?.profile?.resume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        const response = await axios.get(user.profile.resume, {
            responseType: "arraybuffer"
        });

        const { contentDisposition, contentLength, contentType } =
            getResumeResponseHeaders(user, response.headers, true);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", contentDisposition);
        res.setHeader("X-Content-Type-Options", "nosniff");

        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        return res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        console.error("Download Resume Error:", error);

        return res.status(500).json({
            message: "Unable to download resume right now.",
            success: false
        });
    }
};

// ================= VIEW RESUME =================

export const viewResume = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select(
            "fullname profile.resume profile.resumeMimeType profile.resumeOriginalName"
        );

        if (!user?.profile?.resume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        const response = await axios.get(user.profile.resume, {
            responseType: "arraybuffer"
        });

        const { contentDisposition, contentLength, contentType } =
            getResumeResponseHeaders(user, response.headers, false);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", contentDisposition);
        res.setHeader("X-Content-Type-Options", "nosniff");

        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        return res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        console.error("View Resume Error:", error);

        return res.status(500).json({
            message: "Unable to preview resume right now.",
            success: false
        });
    }
};
