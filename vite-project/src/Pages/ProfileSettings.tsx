import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { User, Mail, MapPin, Briefcase, Phone, Camera, Loader2, Save } from "lucide-react";

// Assuming you have a config file or env for API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProfileSettings = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [errors, setErrors] = useState<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const buildImageUrl = (imagePath?: string | null) => {
        if (!imagePath || String(imagePath) === "undefined" || String(imagePath) === "null") return "";
        const cleaned = String(imagePath).replace(/\\/g, "/");
        if (cleaned.startsWith("http")) return cleaned;
        const uploadsIndex = cleaned.indexOf("uploads/");
        const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
        return `${API_BASE_URL}/${relativePath}`;
    };

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        location: "",
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(res.data);
            setFormData({
                fullName: res.data.fullName || "",
                email: res.data.email || "",
                mobileNumber: res.data.mobileNumber || "",
                location: res.data.location || "",
            });
            setPreviewImage(res.data.profilePicture ? buildImageUrl(res.data.profilePicture) : null);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.fullName || formData.fullName.length < 2) {
            newErrors.fullName = "Min 2 chars";
        }
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email";
        }
        if (!phoneRegex.test(formData.mobileNumber)) {
            newErrors.mobileNumber = "Must be 10 digits";
        }
        if (!formData.location) {
            newErrors.location = "Required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setErrors({});

        if (!validateForm()) return;

        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("email", formData.email);
            data.append("mobileNumber", formData.mobileNumber);
            data.append("location", formData.location);
            if (selectedFile) {
                data.append("profilePicture", selectedFile);
            }

            const res = await axios.put(`${API_BASE_URL}/api/user/profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Update local storage user if needed
            const updatedUser = res.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            // Dispatch event to update Navbar
            window.dispatchEvent(new Event("storage"));

            alert("Updated Successfully!");
            setMessage({ type: "success", text: "Updated Successfully!" });
            setSaving(false);
        } catch (err: any) {
            console.error("Update failed", err);
            const msg = err.response?.data?.message || "Failed to update profile";
            if (msg.toLowerCase().includes("email")) {
                setErrors({ email: msg });
            } else {
                setMessage({ type: "error", text: msg });
            }
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12 px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-xl font-bold text-white">Profile Settings</h1>
                        <p className="text-blue-100 text-sm">Update your personal information</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {message.text && (
                            <div
                                className={`mb-6 p-4 rounded-md text-sm ${message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="relative group cursor-pointer hover:opacity-90 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-200">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
                                        title="Change Photo"
                                    >
                                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div className="text-center sm:text-left pt-2">
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                        Profile Picture
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Upload a new photo to personalize your profile.
                                        <br className="hidden sm:block" />
                                        <span className="block sm:inline"> JPG, GIF or PNG. Max size of 5MB.</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                        <span>Full Name</span>
                                        {errors.fullName && <span className="text-red-500 text-xs ml-2">{errors.fullName}</span>}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                        <span>Email Address</span>
                                        {errors.email && <span className="text-red-500 text-xs ml-2">{errors.email}</span>}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                        <span>Mobile Number</span>
                                        {errors.mobileNumber && <span className="text-red-500 text-xs ml-2">{errors.mobileNumber}</span>}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                        <span>Location</span>
                                        {errors.location && <span className="text-red-500 text-xs ml-2">{errors.location}</span>}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="New York, USA"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => window.location.assign("/")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
