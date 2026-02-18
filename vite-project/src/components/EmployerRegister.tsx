import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

const EmployerRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyLocation: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});
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
    const phoneRegex = /^\d{10}$/;

    if (formData.companyName.length < 2) newErrors.companyName = "Min 2 chars";
    if (formData.companyLocation.length < 2) newErrors.companyLocation = "Required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    if (!phoneRegex.test(formData.mobileNumber)) newErrors.mobileNumber = "Must be 10 digits";
    if (formData.password.length < 6) newErrors.password = "Min 6 chars";
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

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Registration successful!");
      setFormData({
        companyName: "",
        companyLocation: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/registration-pending");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("exists")) {
        setErrors({ email: msg });
      } else {
        setError(msg);
      }
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-teal-500">
          Create Your Employer Account
        </h2>
        <p className="mb-6 text-cyan-600 text-center">
          Create an account, fill out your profile, and post jobs.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {errors.companyName && <p className="text-red-500 text-xs mb-1">{errors.companyName}</p>}
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            {errors.companyLocation && <p className="text-red-500 text-xs mb-1">{errors.companyLocation}</p>}
            <input
              type="text"
              name="companyLocation"
              placeholder="Company Location"
              value={formData.companyLocation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mb-1">{errors.confirmPassword}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className=" flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className=" items-center  w-1/2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg hover:bg-orange-800"
            >
              {loading ? "Creating..." : "Create Employer account"}
            </button>
          </div>
          <p className="text-balck font-bold text-center">
            {" "}
            Already have Employer account?
            <a href="/Employeer-Login" className="text-cyan-600 hover:underline">
              {" "} Login
            </a>
          </p>
        </form>
      </div>
    </div>


  );
};

export default EmployerRegister;
