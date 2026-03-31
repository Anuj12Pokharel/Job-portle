import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, ShieldCheck, Loader2 } from "lucide-react";

const ForgotPasswordEmployer: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(
        res.data.message ||
          "A 6-digit OTP has been sent to your company email. Please check your inbox (and spam folder)."
      );
      setStep("otp");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "We couldn't find an employer account with that email. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your passwords.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long for security.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/reset-password`,
        { email, otp, newPassword, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(
        res.data.message ||
          "Your password has been reset successfully! Redirecting to login..."
      );
      setTimeout(() => navigate("/Employeer-Login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please verify your OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-200">
            {step === "email" ? (
              <Mail className="w-7 h-7 text-white" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-white" />
            )}
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold mb-2 text-gray-800">
          Employer Password Reset
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {step === "email"
            ? "Enter your company's registered email. We'll send you a 6-digit verification code."
            : "Enter the OTP sent to your email and set a new password."}
        </p>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company Email
              </label>
              <input
                type="email"
                placeholder="Enter your company email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-3 rounded-lg hover:from-cyan-700 hover:to-teal-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/Employeer-Login")}
                className="text-cyan-600 font-medium hover:underline"
              >
                Back to Login
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Verification Code (OTP)
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-center text-lg tracking-widest font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-3 rounded-lg hover:from-cyan-700 hover:to-teal-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Resetting...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Reset Password
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="text-cyan-600 font-medium hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordEmployer;
