import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

type UserProfile = {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  preferredJobCategory?: string;
  companyName?: string;
  companyLocation?: string;
  profilePicture?: string;
  logo?: string;
  role?: string;
};

const jobCategories = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Operations",
];

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({});
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toAbsolute = useMemo(
    () => (url?: string) => {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      const sanitized = url.replace(/^\/+/, "");
      return `${API_BASE_URL}/${sanitized}`;
    },
    [],
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed: UserProfile = JSON.parse(storedUser);
        setProfile(parsed);
        const rawPic = parsed.profilePicture || parsed.logo || "";
        setPreview(toAbsolute(rawPic));
      } catch (_e) {
        // ignore parse errors
      }
    }
  }, [toAbsolute]);

  const handleChange = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setProfile((prev) => ({ ...prev, profilePicture: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to update your profile.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        if (profile.fullName) formData.append("fullName", profile.fullName);
        if (profile.email) formData.append("email", profile.email);
        if (profile.mobileNumber) formData.append("mobileNumber", profile.mobileNumber);
        if (profile.preferredJobCategory)
          formData.append("preferredJobCategory", profile.preferredJobCategory);
        if (profile.companyName) formData.append("companyName", profile.companyName);
        if (profile.companyLocation) formData.append("companyLocation", profile.companyLocation);

        const fileInput = document.getElementById("profile-file-input") as HTMLInputElement | null;
        if (fileInput?.files?.[0]) {
          formData.append("profilePicture", fileInput.files[0]);
        }

        const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, formData, {
          headers: {
            // Let Axios set the correct multipart boundary automatically.
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.user) {
          const updatedUser = res.data.user as UserProfile;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setProfile(updatedUser);
          setPreview(toAbsolute(updatedUser.profilePicture || updatedUser.logo || ""));
        }

        setMessage(res.data?.message || "Profile updated.");
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to save profile.");
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Profile Settings
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-cyan-700 hover:underline"
          >
            Back
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Update your details and profile picture. (Current implementation saves
          locally; connect to your API to persist server-side.)
        </p>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        {message && <div className="text-green-600 text-sm mb-3">{message}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-cyan-700 text-sm font-semibold">
                  {profile.fullName?.[0]?.toUpperCase() ||
                    profile.companyName?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              )}
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Profile Picture
              </span>
              <input
                type="file"
                accept="image/*"
                id="profile-file-input"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="mt-2 block text-sm text-gray-700"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                value={profile.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Mobile Number
              </span>
              <input
                type="tel"
                value={profile.mobileNumber || ""}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Preferred Job Category
              </span>
              <select
                value={profile.preferredJobCategory || ""}
                onChange={(e) =>
                  handleChange("preferredJobCategory", e.target.value)
                }
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="">Select a category</option>
                {jobCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Employer-specific fields (optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Company Name (optional)
              </span>
              <input
                type="text"
                value={profile.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Company Location (optional)
              </span>
              <input
                type="text"
                value={profile.companyLocation || ""}
                onChange={(e) =>
                  handleChange("companyLocation", e.target.value)
                }
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




