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

    // Fake submit delay
    setTimeout(() => {
      alert("Form submitted!\n" + JSON.stringify(formData, null, 2));
      setIsSubmitting(false);
      // Reset form if you want:
      // setFormData({ fullName: "", designation: "", email: "", contactNumber: "", fieldOfExpertise: "", employmentStatus: "" });
      // setSelectedFile(null);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Form
        formData={formData}
        onInputChange={handleInputChange}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
