import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

const EmployerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.token) {
        setSuccess("Login successful!");

        // Store token (remember me logic)
        const storage = formData.remember ? localStorage : sessionStorage;
        storage.setItem("token", res.data.token);

        // Store user/admin info
        if (res.data.user) {
          storage.setItem("user", JSON.stringify(res.data.user));
        } else if (res.data.admin) {
          storage.setItem("user", JSON.stringify(res.data.admin));
        }

        // Redirect based on role
        if (res.data.admin?.role === "superadmin") {
          navigate("/super-admin-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-center text-xl font-semibold mb-2">
          Welcome back to JobLink360!
        </h2>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Login with your registered Email or Phone number.
        </p>

        {/* Error / Success */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        {/* Identifier */}
        <input
          type="text"
          name="identifier"
          placeholder="Email address / Phone number"
          value={formData.identifier}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Remember Me */}
        <div className="flex items-center mb-4">
          <input
            id="remember"
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-orange-600 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
            Remember me
          </label>
        </div>

        {/* Forgot Password */}
        <div className="text-sm mb-4 text-left">
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
          className={`w-full py-2 rounded-md text-white transition 
            ${
              loading
                ? "bg-cyan-500 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-orange-600"
            }
          `}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-gray-700 mt-6 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/Employeer-Register"
            className="text-blue-600 hover:underline"
          >
            Register now
          </Link>
        </p>

        {/* Google Sign In */}
        <p className="text-center text-gray-500 mt-2 text-sm">
          Or 
        </p>
        <div className="mt-4">
          <GoogleSignIn />
        </div>
      </form>
    </div>
  );
};

export default EmployerLogin;
