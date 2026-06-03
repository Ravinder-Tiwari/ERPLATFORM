import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_PORT) === "465",
  auth: {
    user: process.env.EMAIL_USER || process.env.GOOGLE_USER,
    pass: String(process.env.EMAIL_PASS || process.env.GOOGLE_APP_PASSWORD || "").replace(/\s+/g, ""),
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER || process.env.GOOGLE_USER,
    to,
    subject,
    text, 
    html,
  });
console.log(sendEmail)
  return info;
};