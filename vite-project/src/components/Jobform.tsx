import React, { useState } from "react";
import Form from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import { Briefcase, X } from "lucide-react";
import { createPortal } from "react-dom";

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
    <div className="w-full">
      <div className="p-5 sm:p-7 rounded-3xl border-2 border-cyan-500 bg-white shadow-xl ring-4 ring-cyan-50/50 hover:shadow-2xl transition-all duration-300 group">
        <div className="text-center">
          <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
             <Briefcase className="text-cyan-600 w-6 h-6" />
          </div>
          <p className="text-lg sm:text-xl mb-4 text-gray-800 font-extrabold leading-tight">
            Looking for New Opportunity?
          </p>
          <button
            className="w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-cyan-700 active:scale-95 transition-all shadow-md shadow-cyan-200"
            onClick={() => setShowForm(true)}
          >
            Open to New Roles
          </button>
        </div>

        {showForm && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:rotate-90 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-4 sm:p-10">
                <Form
                  formData={formData}
                  onInputChange={handleInputChange}
                  selectedFile={selectedFile}
                  onFileChange={handleFileChange}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
            {/* Close on click outside */}
            <div className="absolute inset-0 -z-10" onClick={() => setShowForm(false)} />
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
