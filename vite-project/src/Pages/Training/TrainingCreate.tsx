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
    shifts: [] as string[],
    students: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShiftToggle = (shift: string) => {
    setFormData((prev) => {
      const isSelected = prev.shifts.includes(shift);
      const updatedShifts = isSelected
        ? prev.shifts.filter((s) => s !== shift)
        : [...prev.shifts, shift];
      return { ...prev, shifts: updatedShifts };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
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

    if (!imageFile) {
      setError("Please select an image for the training");
      setLoading(false);
      return;
    }

    try {
      // 2. Create FormData for file upload
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("instructor", formData.instructor);
      data.append("duration", formData.duration);
      data.append("price", formData.price);
      data.append("startDate", formData.startDate);

      // Append each shift
      formData.shifts.forEach((shift) => data.append("shifts[]", shift));

      data.append("students", formData.students || "0");
      data.append("image", imageFile);

      // 3. Include the token in the headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(`${API_BASE_URL}/api/training`, data, config);

      alert("Training created successfully");

      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        price: "",
        startDate: "",
        shifts: [],
        students: "",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      // 4. Improve error message handling
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
              <label className="text-sm font-semibold text-gray-700 mb-1">Training Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Preferred Shifts</label>
              <div className="flex gap-4 p-3 border rounded-lg bg-white">
                {["Morning", "Day", "Evening"].map((shiftOption) => (
                  <label key={shiftOption} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shifts.includes(shiftOption)}
                      onChange={() => handleShiftToggle(shiftOption)}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">{shiftOption}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Number of Students</label>
              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleChange}
                placeholder="e.g. 200"
                min="0"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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