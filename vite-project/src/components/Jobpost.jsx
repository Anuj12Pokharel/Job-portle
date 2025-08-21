import React, { useState } from "react";
import axios from "axios";

const Jobpost = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    category: "",
    location: "",
    jobLevel: "",
    salary: "",
    educationLevel: "",
    desiredCandidate: "",
    experience: "",
    expiryDate: "",
    description: "",
  });

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
      const response = await axios.post(
        "https://job-portle-backend-fsai.onrender.com/api/jobs/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || "Job posted successfully!");
      setFormData({
        companyName: "",
        position: "",
        category: "",
        location: "",
        jobLevel: "",
        salary: "",
        educationLevel: "",
        desiredCandidate: "",
        experience: "",
        expiryDate: "",
        description: "",
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
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
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
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          name="jobLevel"
          placeholder="Job Level"
          value={formData.jobLevel}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

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
        />

        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
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
