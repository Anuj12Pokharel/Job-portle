import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface JobFormData {
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  aboutCompany: string;
  position: string;
  category: string;
  location: string;
  jobLevel: string;
  jobType: string;
  salary: string;
  educationLevel: string;
  desiredCandidate: string;
  experience: string;
  expiryDate: string;
  noOfOpenings: string;
  industry: string;
  skills: string;
  description: string;
  additionalRequirements: string;
}

const INITIAL_FORM: JobFormData = {
  companyName: "",
  companyAddress: "",
  companyWebsite: "",
  aboutCompany: "",
  position: "",
  category: "",
  location: "",
  jobLevel: "",
  jobType: "Full-time",
  salary: "",
  educationLevel: "",
  desiredCandidate: "",
  experience: "",
  expiryDate: "",
  noOfOpenings: "",
  industry: "",
  skills: "",
  description: "",
  additionalRequirements: "",
};

const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Internship", "Contract", "Remote"] as const;

const JOB_LEVEL_OPTIONS = [
  { value: "", label: "Select Job Level" },
  { value: "Entry-level", label: "Entry-level" },
  { value: "Mid-level", label: "Mid-level" },
  { value: "Senior-level", label: "Senior-level" },
  { value: "Executive", label: "Executive" },
  { value: "Internship", label: "Internship" },
] as const;

const Jobpost: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Auto-fill company details from logged-in employer profile
  useEffect(() => {
    const fetchLatestProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/employer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          const user = res.data;
          setFormData((prev) => ({
            ...prev,
            companyName: user.companyName || prev.companyName,
            companyAddress: user.companyLocation || prev.companyAddress,
            companyWebsite: user.companyWebsite || prev.companyWebsite,
            aboutCompany: user.aboutCompany || prev.aboutCompany,
          }));
          // Keep localStorage in sync
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        console.error("Failed to fetch latest profile for auto-fill", err);
      }
    };

    fetchLatestProfile();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user) {
          setFormData((prev) => ({
            ...prev,
            companyName: user.companyName || "",
            companyAddress: user.companyLocation || "",
            companyWebsite: user.companyWebsite || "",
            aboutCompany: user.aboutCompany || "",
          }));
        }
      } catch {
        console.error("Failed to parse user data from localStorage");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      // Map companyAddress back to location for backend compatibility
      data.set("location", formData.companyAddress);

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/jobs/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Job posted successfully! Your listing is now live.");
      setFormData(INITIAL_FORM);

      // Re-populate company fields
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          companyName: user.companyName || "",
          companyAddress: user.companyLocation || "",
          companyWebsite: user.companyWebsite || "",
          aboutCompany: user.aboutCompany || "",
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Post New Job</h2>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details below to publish a new job listing.
      </p>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ─── Section 1: Company Details ─── */}
        <fieldset className="border border-gray-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-gray-700 px-2">
            Company Details
          </legend>
          <p className="text-xs text-gray-400 mb-4">
            Auto-filled from your company profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                readOnly
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <span className="text-xs text-gray-400">Auto-filled from your company profile</span>
            </div>

            {/* Position / Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Position / Job Title
              </label>
              <input
                type="text"
                name="position"
                placeholder="e.g. Frontend Developer"
                value={formData.position}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>

            {/* Company Address */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company Address
              </label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                readOnly
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <span className="text-xs text-gray-400">Auto-filled from your company profile</span>
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company Website
              </label>
              <input
                type="text"
                name="companyWebsite"
                placeholder="https://example.com"
                value={formData.companyWebsite}
                readOnly
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <span className="text-xs text-gray-400">Auto-filled from your company profile</span>
            </div>
          </div>
        </fieldset>

        {/* ─── Section 2: Job Details ─── */}
        <fieldset className="border border-gray-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-gray-700 px-2">
            Job Details
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              >
                {JOB_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Software Development"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Job Level */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Level
              </label>
              <select
                name="jobLevel"
                value={formData.jobLevel}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              >
                {JOB_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                placeholder="e.g. 30,000 - 50,000"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* No. of Openings */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                No. of Openings
              </label>
              <input
                type="number"
                name="noOfOpenings"
                placeholder="e.g. 3"
                min="1"
                value={formData.noOfOpenings}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. Information Technology"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Education Level
              </label>
              <input
                type="text"
                name="educationLevel"
                placeholder="e.g. Bachelor's Degree"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {/* Experience (Required) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Experience (Required)
              </label>
              <input
                type="text"
                name="experience"
                placeholder="e.g. 2+ years"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

          </div>

          {/* Skills - full width */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Skills Required
            </label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. React, Node.js, TypeScript (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>

          {/* Desired Candidate - full width */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Desired Candidate Profile
            </label>
            <textarea
              name="desiredCandidate"
              placeholder="Describe your ideal candidate..."
              value={formData.desiredCandidate}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            />
          </div>

          {/* Job Description - full width */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            />
          </div>
        </fieldset>

        {/* ─── Section 3: Additional Requirements ─── */}
        <fieldset className="border border-gray-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-gray-700 px-2">
            Additional Requirements
          </legend>
          <p className="text-xs text-gray-400 mb-4">
            Specify any additional qualifications or requirements for the role.
          </p>


          {/* Additional Requirements - full width */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Other Requirements
            </label>
            <textarea
              name="additionalRequirements"
              placeholder="Any specific requirements, certifications, tools, or soft skills the employee must have..."
              value={formData.additionalRequirements}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            />
          </div>
        </fieldset>

        {/* ─── Submit Button ─── */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-200"
          >
            {loading ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Jobpost;
