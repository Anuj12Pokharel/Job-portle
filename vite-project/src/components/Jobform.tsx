import React, { useState } from "react";
import Form from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";

export default function Jobform() {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    phone: "",       // backend expects this
    expertise: "",   // backend expects this
    employmentStatus: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Handle input changes
  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Handle file selection
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append("cv", selectedFile); // must match backend field name
      }

      // DEBUG: check what’s being sent
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send POST request (do NOT manually set Content-Type)
      const res = await axios.post(
        `${API_BASE_URL}/api/talent/submit`,
        formDataToSend
      );

      toast.success(res.data.message);
      console.log(res.data.message);

      // Reset form
      setFormData({
        fullName: "",
        designation: "",
        email: "",
        phone: "",
        expertise: "",
        employmentStatus: "",
      });
      setSelectedFile(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="p-6 rounded-xl border-2 border-cyan-500 bg-white shadow-lg ring-2 ring-cyan-300">
        <div className="text-center mb-6">
          <p className="text-2xl mb-4 text-cyan-600 font-bold">
            Looking for new opportunity?
          </p>
          <button
            className="border border-gray-400 text-cyan-600 px-6 py-2 rounded hover:bg-gray-300 transition"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close form" : "Open to new roles"}
          </button>
        </div>

        {showForm && (
          <div className="w-full max-w-4xl mb-8 text-center mx-auto">
            <Form
              formData={formData}
              onInputChange={handleInputChange}
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        <div className="w-full max-w-6xl"></div>
      </div>
    </div>
  );
}
