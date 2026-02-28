import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    permanentAddress: "",
    temporaryAddress: "",
    academicDegree: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      const numericOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // 

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Minimum 2 characters required";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter valid Nepal mobile number";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "Permanent address is required";
    }

    if (!formData.temporaryAddress.trim()) {
      newErrors.temporaryAddress = "Temporary address is required";
    }

    if (!formData.academicDegree.trim()) {
      newErrors.academicDegree = "Academic degree is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Registration successful!");
      console.log("Response:", res.data);

      setTimeout(() => {
        navigate("/Jobseeker-Login");
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";

      if (msg.toLowerCase().includes("email")) {
        setErrors((prev: any) => ({ ...prev, email: msg }));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">

      {/* Success Modal Overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-sm w-full mx-4 animate-bounce-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Registration Successful!</h3>
            <p className="text-gray-500 text-center">Your account has been created.<br />Redirecting you to login...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div className="bg-green-500 h-1.5 rounded-full animate-[shrink_2.5s_linear_forwards]"
                style={{ animation: "shrink 2.5s linear forwards" }} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-cyan-600 mb-2">
          Create Jobseeker Account
        </h2>

        <p className="text-center text-teal-500 mb-6">
          Register and apply for jobs for free
        </p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mb-1">{errors.fullName}</p>
            )}
            <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mb-1">
                {errors.mobileNumber}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Email */}
          <div>
            {errors.email && (
              <p className="text-red-500 text-xs mb-1">{errors.email}</p>
            )}
            <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Academic (Last Degree) */}
          <div>
            {errors.academicDegree && (
              <p className="text-red-500 text-xs mb-1">
                {errors.academicDegree}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700">Academic (Last Degree) <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="academicDegree"
              placeholder="Academic (Last Degree)"
              value={formData.academicDegree}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Permanent Address */}
          <div>
            {errors.permanentAddress && (
              <p className="text-red-500 text-xs mb-1">
                {errors.permanentAddress}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700">Permanent Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="permanentAddress"
              placeholder="Permanent Address"
              value={formData.permanentAddress}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Temporary Address */}
          <div>
            {errors.temporaryAddress && (
              <p className="text-red-500 text-xs mb-1">
                {errors.temporaryAddress}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700">Temporary Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="temporaryAddress"
              placeholder="Temporary Address"
              value={formData.temporaryAddress}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Password */}
          <div>
            {errors.password && (
              <p className="text-red-500 text-xs mb-1">{errors.password}</p>
            )}
            <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mb-1">
                {errors.confirmPassword}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-1"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center font-semibold text-black">
            Already have an account?{" "}
            <Link
              to="/Jobseeker-Login"
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
