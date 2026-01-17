"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Ensure env is loaded even if server imports this before main dotenv.config()
dotenv_1.default.config();
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_APP_PASSWORD;
if (!user || !pass) {
    console.warn("Email credentials are not set (EMAIL_USER / EMAIL_APP_PASSWORD). OTP emails will fail.");
}
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user,
        pass,
    },
});
const sendEmail = async (to, subject, text) => {
    if (!user || !pass) {
        throw new Error("Email credentials not configured");
    }
    await exports.transporter.sendMail({
        from: `"Job Portal" <${user}>`,
        to,
        subject,
        text,
    });
};
exports.sendEmail = sendEmail;
