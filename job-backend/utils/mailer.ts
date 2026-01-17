import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Ensure env is loaded even if server imports this before main dotenv.config()
dotenv.config();

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.warn("Email credentials are not set (EMAIL_USER / EMAIL_APP_PASSWORD). OTP emails will fail.");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!user || !pass) {
    throw new Error("Email credentials not configured");
  }
  await transporter.sendMail({
    from: `"Job Portal" <${user}>`,
    to,
    subject,
    text,
  });
};

