import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const ServiceInquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company_size: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/service-inquiry`, formData);

      // Show success message
      setStatus(res.data.message);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        company_size: "",
        service: "",
        message: "",
      });
    } catch (err: any) {
      console.error(err.response?.data || err);
      setStatus(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="flex flex-col lg:flex-1 lg:max-w-2xl relative px-1 lg:px-0 w-full">
      <div className="bg-gradient-to-br from-white via-sky-50 to-white p-6 sm:p-8 rounded-2xl shadow-md mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-sky-600 mt-3">
          Service Inquiry
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Row 1: Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your mobile"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: Email + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 3: Company size + Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Company size</label>
              <input
                type="text"
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                placeholder="Enter your company size"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Choose service</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Enter service"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-1">
              Write your message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your query here..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              rows={4}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-cyan-600 text-white px-6 py-2 mt-4 rounded hover:bg-cyan-700 flex justify-center sm:justify-start items-center gap-2 transition-colors duration-200"
          >
            Send message
          </button>

          {status && <p className="mt-4 text-center text-cyan-600">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ServiceInquiry;
