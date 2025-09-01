import React, { useState } from "react";

const ServiceInquiry = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    email: "",
    Address: "",
    Compnay_size:"",
    Choose_service:"",
    Write_your_message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the data to backend here
    console.log(formData);
    setStatus("Your message has been sent!");
    setFormData({
      Name: "",
    Phone: "",
    email: "",
    Address: "",
    Compnay_size:"",
    Choose_service:"",
    Write_your_message: "",
    });
  };

  return (
    <div className="flex flex-col lg:flex-1 lg:max-w-xl relative px-4 sm:px-6 lg:px-0 w-full">
      <div className="bg-gradient-to-br from-white via-sky-50 to-white p-6 sm:p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-sky-600">
          Service Inquiry
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
            <label className="block font-semibold mb-1"> Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Enter your  name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>

         <div className="flex-1">
            <label className="block font-semibold mb-1">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Enter your mobile"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>

        </div>

         <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
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
<div className="flex-1">
            <label className="block font-semibold mb-1">Address</label>
            <input
              type="text"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              placeholder="Enter your Address"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>
         </div>
        <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
            <label className="block font-semibold mb-1">Company size</label>
            <input
              type="text"
              name="Company Size"
              value={formData.Compnay_size}
              onChange={handleChange}
              placeholder="Choose your company size"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>
          
 <div className="flex-1">
            <label className="block font-semibold mb-1">Choose service</label>
            <input
              type="text"
              name="Choose service"
              value={formData.Choose_service}
              onChange={handleChange}
              placeholder="Choose your service"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>
          
        </div>
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

          <button
            type="submit"
            className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2 mt-4 rounded hover:bg-orange-700 flex justify-center sm:justify-start items-center gap-2 transition-colors duration-200"
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
