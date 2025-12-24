import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (formData.fullName.length < 2) newErrors.fullName = "Min 2 characters";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    if (!phoneRegex.test(formData.mobileNumber)) newErrors.mobileNumber = "Must be 10 digits";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSuccess("");

    if (!validateForm()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Registration successful!");
      console.log("Response:", res.data);
      setTimeout(() => navigate("/Jobseeker-Login"), 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("exists")) {
        setErrors({ email: msg });
      } else {
        setError(msg);
      }
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-cyan-600">
          Create Your Free Jobseeker Account
        </h2>
        <p className="mb-6 text-teal-500 text-center">
          Create an account, fill out your profile, and apply for jobs at no cost.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {errors.fullName && <p className="text-red-500 text-xs mb-1">{errors.fullName}</p>}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            {errors.mobileNumber && <p className="text-red-500 text-xs mb-1">{errors.mobileNumber}</p>}
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            {errors.email && <p className="text-red-500 text-xs mb-1">{errors.email}</p>}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            {errors.password && <p className="text-red-500 text-xs mb-1">{errors.password}</p>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mb-1">{errors.confirmPassword}</p>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all"
          >
            Create Jobseeker Account
          </button>

          <p className="text-center text-gray-700 mt-2">
            Already have an account? Login or sign in with Google
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
