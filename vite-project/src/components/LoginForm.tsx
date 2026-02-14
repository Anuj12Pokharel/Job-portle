import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import GoogleSignIn from './GoogleSignIn';

const LoginForm = () => {
  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://job-portle-backend-fsai.onrender.com";
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSuccess("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const { identifier, password } = formData;

    if (!identifier) {
      setError("Please enter email/phone and password");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      setError("Please enter a valid Email or 10-digit Phone Number");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (res.data.token) {
        setSuccess("Login successful!");
        localStorage.setItem("token", res.data.token);

        // Always persist user for navbar/profile display; "remember" can be used for future persistence rules
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        // Trigger auth refresh and hard reload to reflect logged-in UI
        window.dispatchEvent(new Event("storage"));

        const from = location.state?.from || "/";
        navigate(from, { replace: true });
        return;
      }

      // Surface an error if the response is missing the expected token
      setError("Login failed. No token returned from server.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
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
          Login with your registered Email and Password.
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
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-white py-2 rounded-md hover:bg-cyan-600 transition"
        >
          {loading ? "Logging..." : "Login"}
        </button>

        {/* Register + Google */}
        <p className="text-center text-gray-700 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/Jobseeker-Register" className="text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
        <div className="mt-4">
          <GoogleSignIn role="user" />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;






