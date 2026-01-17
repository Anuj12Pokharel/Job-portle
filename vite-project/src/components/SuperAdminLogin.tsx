import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const SuperAdminLogin = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/admin/login`,
                formData,
                { headers: { "Content-Type": "application/json" } },
            );

            if (res.data.token) {
                if (res.data.admin?.role !== "superadmin") {
                    setError("Access Restricted. This portal is for Super Admins only.");
                    setLoading(false);
                    return;
                }

                localStorage.setItem("token", res.data.token);
                if (res.data.admin) {
                    localStorage.setItem("user", JSON.stringify(res.data.admin));
                }

                window.dispatchEvent(new Event("storage"));
                window.location.assign("/super-admin-dashboard");
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
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm border-t-4 border-blue-600"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                        <ShieldAlert className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Management Login</h2>
                    <p className="text-gray-500 text-sm">Super Admin Access Only</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email / ID</label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
                >
                    {loading ? "Authenticating..." : "Access Dashboard"}
                </button>

                <div className="mt-6 text-center">
                    <button type="button" onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-gray-700">
                        Back to Home
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SuperAdminLogin;
