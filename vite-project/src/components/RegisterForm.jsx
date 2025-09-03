import React, { useState } from "react";
import axios from "axios";
import register from "../assets/register.png";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    preferredJobCategory: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://job-portle-backend-fsai.onrender.com/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Registration successful!");
      console.log("Response:", res.data);
      setTimeout(() => {
        navigate("/Jobseeker-Login"); 
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse items-stretch justify-center min-h-screen bg-gray-50 px-4">
      {/* Left Side: Form */}
    <div className="w-full md:w-1/3 flex py-14">
        <div className=" flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-center text-cyan-600">
          Create your free jobseeker account
        </h2>
        <p className="mb-4 text-teal-500 text-center">
          Create an account, fill out your profile, and apply for jobs at no
          cost.
        </p>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500 text-center text-2xl">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <select
            name="preferredJobCategory"
            value={formData.preferredJobCategory}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            <option value="">Select Preferred Job Category</option>
            <option value="Software Development">Software Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-800"
            >
              Create jobseeker account
            </button>
          </div>

          <p className="text-black font-bold text-center">
            Already have jobseeker account? Login Or login with google
          </p>
        </form>
      </div>
    </div>

      {/* Right Side: Image */}
      <div className="w-full md:w-1/2 md:flex justify-center mt-8 md:mt-0 py-14 px-6">
        <img
          src={register}
          alt="Register Illustration"
          className="w-full h-full object-cover rounded-lg hidden md:block"
        />
      </div>
    </div>
  );
};

export default RegisterForm;
