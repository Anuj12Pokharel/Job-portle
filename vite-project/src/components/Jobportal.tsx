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
  const [showForm, setShowForm] = useState(false);

  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    <div className=" bg-gradient-to-r bg-cyan-100 p-6 flex flex-col items-center rounded-xl">
      <div className="text-center mb-6">
        <p className="text-2xl  mb-4 text-cyan-600 font-bold">
          Looking for new opportunity?
        </p>
        <button
          className="border border-gray-400 text-cyan-600 px-6 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Close form G��" : "Open to new role G��"}
        </button>
      </div>

      {/* Only render form when it's open */}
      {showForm ? (
        <div className="w-full max-w-4xl mb-8">
          <Form
            formData={formData}
            onInputChange={handleInputChange}
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}

      {/* Jobcard section always visible */}
      <div className="w-full max-w-6xl"></div>
    </div>
  );
}
