import React from "react";
import { Upload, User, Mail, Phone, Briefcase } from "lucide-react";

export default function Form({
  formData,
  onInputChange,
  selectedFile,
  onFileChange,
  isSubmitting,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="bg-cyan-600 text-white text-center py-4">
        <h2 className="text-xl font-semibold">
          Join Our Exclusive Talent Network
        </h2>
        <p className="text-sm opacity-90">
          Submit your details to get notified of new roles
        </p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="fullName"
                type="text"
                placeholder=""
                value={formData.fullName}
                onChange={(e) => onInputChange("fullName", e.target.value)}
                className="pl-10 border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>

          {/* Current/Last Designation */}
          <div className="space-y-2">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Current/Last Designation *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="designation"
                type="text"
                placeholder=""
                value={formData.designation}
                onChange={(e) => onInputChange("designation", e.target.value)}
                className="pl-10 border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>

          {/* Professional Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Professional Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                className="pl-10 border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="contactNumber"
                type="tel"
                placeholder=""
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className="pl-10 border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>

          {/* Field of Expertise */}
          <div className="space-y-2">
            <label
              htmlFor="fieldOfExpertise"
              className="block text-sm font-medium text-gray-700"
            >
              Field of Expertise *
            </label>
            <select
              id="fieldOfExpertise"
              value={formData.expertise}
              onChange={(e) =>
                onInputChange("expertise", e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Select your field</option>
              <option value="information-technology">
                Information Technology
              </option>
              <option value="finance-banking">Finance & Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="marketing-sales">Marketing & Sales</option>
              <option value="engineering">Engineering</option>
              <option value="education">Education</option>
              <option value="design-creative">Design & Creative</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Current Employment Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Employment Status *
            </label>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentStatus"
                  value="still-working"
                  checked={formData.employmentStatus === "still-working"}
                  onChange={() =>
                    onInputChange("employmentStatus", "still-working")
                  }
                  required
                />
                <span className="ml-2">Still Working</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentStatus"
                  value="actively-seeking"
                  checked={formData.employmentStatus === "actively-seeking"}
                  onChange={() =>
                    onInputChange("employmentStatus", "actively-seeking")
                  }
                />
                <span className="ml-2">Actively Seeking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Upload CV Section */}
        <div className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Your Updated CV *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 relative">
            <p className="text-sm text-gray-600">
              PDF, DOC, or DOCX (Max: 5MB)
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required={!selectedFile}
            />
            <button
              type="button"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded inline-flex items-center justify-center mx-auto"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </button>
          </div>
          {selectedFile && (
            <p className="text-sm text-green-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-12 py-3 text-lg rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </form>
  );
}
