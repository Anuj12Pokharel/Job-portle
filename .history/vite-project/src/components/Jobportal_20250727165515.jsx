import React, { useState } from "react";
import Form from "./Form";

export default function JobPortal() {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    contactNumber: "",
    fieldOfExpertise: "",
    employmentStatus: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert("Form submitted!\n" + JSON.stringify(formData, null, 2));
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="text-center mb-6">
        <p className="text-lg font-medium mb-2">Looking for new opportunity?</p>
        <button
          className="border border-green-600 text-green-700 px-6 py-2 rounded hover:bg-green-100 transition"
          onClick={() => setShowForm(prev => !prev)} // Toggle form visibility
        >
          {showForm ? "Close form ✕" : "Open to new role →"}
        </button>
      </div>

      {/* Show form if toggle is on */}
      {showForm && (
        <Form
          formData={formData}
          onInputChange={handleInputChange}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
