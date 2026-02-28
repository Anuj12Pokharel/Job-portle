import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const Jobpost = () => {
  const [formData, setFormData] = useState({
    companyName: "",
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
    vehicleLicense: "",
    twoFourWheeler: "",
    skills: "",
    description: "",
    aboutCompany: "",
    companyWebsite: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user) {
          setFormData(prev => ({
            ...prev,
            companyName: user.companyName || "",
            location: user.companyLocation || ""
          }));
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  // Submit job post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (logo) data.append("logo", logo);

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/api/jobs/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(response.data.message || "Job posted successfully!");
      setFormData({
        companyName: "",
        position: "",
        category: "",
        location: "",
        jobLevel: "",
        jobType: "",
        salary: "",
        educationLevel: "",
        desiredCandidate: "",
        experience: "",
        expiryDate: "",
        noOfOpenings: "",
        industry: "",
        vehicleLicense: "",
        twoFourWheeler: "",
        skills: "",
        description: "",
        aboutCompany: "",
        companyWebsite: "",
      });
      setLogo(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          readOnly
          className="border p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
          required
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="number"
          name="noOfOpenings"
          placeholder="No. of Openings"
          value={formData.noOfOpenings}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          readOnly
          className="border p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        <input
          type="text"
          name="jobLevel"
          placeholder="Job Level"
          value={formData.jobLevel}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Job Type
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="educationLevel"
          placeholder="Education Level"
          value={formData.educationLevel}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        />

        <input
          type="date"
          name="expiryDate"
          placeholder="Expirydate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="vehicleLicense"
          placeholder="Vehicle License (Optional)"
          value={formData.vehicleLicense}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="twoFourWheeler"
          placeholder="Two/Four Wheeler"
          value={formData.twoFourWheeler}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full col-span-2"
        />

        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className="border p-3 rounded-lg w-full"
        />

        <textarea
          name="desiredCandidate"
          placeholder="Desired Candidate"
          value={formData.desiredCandidate}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full col-span-2"
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full col-span-2"
        />
        <input
          type="AboutCompany"
          name="aboutCompany"
          placeholder="AboutCompany"
          value={formData.aboutCompany}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="CompnayWebsite"
          name="companyWebsite"
          placeholder="CompanyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-1/2 justify-items-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default Jobpost;
