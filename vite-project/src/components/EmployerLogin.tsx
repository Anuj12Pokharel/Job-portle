import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

const EmployerLogin = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        formData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (res.data.token) {
        setSuccess("Login successful!");
        localStorage.setItem("token", res.data.token);

        // Always persist user/admin info so navbar can show the logged-in state
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else if (res.data.admin) {
          localStorage.setItem("user", JSON.stringify(res.data.admin));
        }
        // Trigger auth refresh and hard reload to reflect logged-in UI
        window.dispatchEvent(new Event("storage"));

        if (res.data.admin?.role === "superadmin") {
          window.location.assign("/super-admin-dashboard");
        } else {
          window.location.assign("/admin-dashboard");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-center text-xl font-semibold mb-2">
          Welcome back to joblink360!
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Login with your registered Email &amp; Password.
        </p>

        {/* Error / Success Messages */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        {/* Identifier (email or phone) */}
        <input
          type="text"
          name="identifier"
          placeholder="Email address / Phone number"
          value={formData.identifier}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Remember Me */}
        <div className="flex items-center mb-4">
          <input
            id="remember"
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-gray-700 text-sm">
            Remember me?
          </label>
        </div>

        {/* Forgot Password */}
        <div className="mb-4 text-sm text-left">
          <button
            type="button"
            onClick={() => navigate("/forgot-password-employer")}
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
        >
          {loading ? "Logging..." : "Login"}
        </button>

        {/* Register + Google */}
        <p className="text-center text-gray-700 mt-6 text-sm">
          DonG��t have an account?{" "}
          <Link to="/Employeer-Register" className="text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
        <p className="text-center text-gray-500 mt-2 text-sm">
          Or login with Google
        </p>
        <div className="mt-4">
          <GoogleSignIn role="admin" />
        </div>
      </form>
    </div>
  );
};

export default EmployerLogin;
