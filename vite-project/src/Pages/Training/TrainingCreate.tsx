import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const CreateTraining = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    price: "",
    startDate: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // 2. Include the token in the headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${API_BASE_URL}/api/training`, formData, config);
      
      alert("Training created successfully");

      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        price: "",
        startDate: "",
        image: "",
      });
    } catch (err: any) {
      // 3. Improve error message handling
      console.error("Error creating training:", err);
      setError(err.response?.data?.message || "Failed to create training. Only admins can perform this action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent">
            Create Training
          </h2>
          <p className="text-gray-600">
            Add a new training program for users
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Training Title"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Instructor</label>
                <input
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Instructor Name"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Duration</label>
                <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration (e.g. 6 Weeks)"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Price</label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-4 font-semibold bg-gray-100">Rs</span>
                <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full p-3 focus:outline-none"
                    required
                />
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="md:col-span-2 flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Training Description"
                className="border rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Training"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateTraining;