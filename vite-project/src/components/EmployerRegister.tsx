import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import register from "../assets/register.png";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (formData.companyName.length < 2) {
      newErrors.companyName = "Min 2 chars";
    }
    if (formData.companyLocation.length < 2) {
      newErrors.companyLocation = "Required";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phoneRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Must be 10 digits";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Min 6 chars";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/register`,
        formData,
        { headers: { "Content-Type": "application/json" } },
      );

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
    } catch (err) {
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
    <div className="flex flex-col md:flex-row items-stretch justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full md:w-1/3 flex py-14">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-center text-teal-500">
            Create your free Employeer account{" "}
          </h2>
          <p className="mb-4 text-cyan-600 text-center">
            Create an account, fill out your profile, and apply for jobs at no
            cost.
          </p>

          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <p className="text-green-500 text-center  text-2xl">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.companyName && <p className="text-red-500 text-xs mb-1 ml-1">{errors.companyName}</p>}
            <input
              type="text"
              name="companyName"
              placeholder="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            {errors.companyLocation && <p className="text-red-500 text-xs mb-1 ml-1">{errors.companyLocation}</p>}
            <input
              type="text"
              name="companyLocation"
              placeholder="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mb-1 ml-1">{errors.email}</p>}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            {errors.mobileNumber && <p className="text-red-500 text-xs mb-1 ml-1">{errors.mobileNumber}</p>}
            <input
              type="text"
              name="mobileNumber"
              placeholder="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            {errors.password && <p className="text-red-500 text-xs mb-1 ml-1">{errors.password}</p>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            {errors.confirmPassword && <p className="text-red-500 text-xs mb-1 ml-1">{errors.confirmPassword}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <div className=" flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className=" items-center  w-1/2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg hover:bg-orange-800"
              >
                {loading ? "Creating..." : "Create jobseeker account"}
              </button>
            </div>
            <p className="text-balck font-bold text-center">
              {" "}
              Already have jobseeker account? Login Or login with google{" "}
            </p>
          </form>
        </div>
      </div>
      <div className="w-full md:w-1/2 hidden md:flex py-14 px-4">
        <img
          src={register}
          alt="Register Illustration"
          className="w-full h-full object-cover rounded-lg "
        />
      </div>
    </div>
  );
};

export default EmployerRegister;
