import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import backgroundImage from "../assets/back.jpeg";

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contact`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setStatus("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.message || "Something went wrong");
      } else {
        setStatus("Error: " + error.message);
      }
    }
  };
  return (
    <>
      <div
        className="relative bg-cover bg-center h-[350px] flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {" "}
        <p className="text-white font-bold text-2xl"> Contact us </p>
      </div>
      <div
        id="contact"
        className="bg-white w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-3xl font-bold text-cyan-600">Get in Touch</h1>
          <p className="text-lime-600 mt-4">
            Have questions or need assistance?
          </p>
          <p className="text-lime-600 mt-2">
            Feel free to fill out the form below or reach out to us directly at
            01-4502062.
          </p>
        </div>

        {/* Main Flex Container */}
        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-12 lg:gap-52 justify-center items-start">
          {/* Left: Map */}
          <div className="flex-1 lg:max-w-lg flex flex-col items-center justify-center w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center text-cyan-600">
              Our Location
            </h2>
            <iframe
              title="Kathmandu Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3420.775863769035!2d85.34498043755795!3d27.722529770008887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900629884c9%3A0xf7eeccbe33368be!2sHAMRO%20JOB%20PVT.%20LTD.!5e1!3m2!1sen!2snp!4v1756181546899!5m2!1sen!2snp"
              width="100%"
              height="550"
              className="rounded-xl border-0"
              loading="lazy"
            ></iframe>
          </div>

          {/* Right: Contact Form */}
          <div className="flex flex-col lg:flex-1 lg:max-w-xl relative px-4 sm:px-6 lg:px-0 w-full">
            <div className=" bg-gradient-to-br from-white via-sky-50 to-white p-6 sm:p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-sky-600">
                Contact Us
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div flex-1>
                    <label className="block font-semibold mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-semibold mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Email address
                  </label>
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
                  <label className="block font-semibold mb-1">
                    Phone number
                  </label>
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

                <div>
                  <label className="block font-semibold mb-1">
                    How may we support you:
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
                {status && (
                  <p className="mt-4 text-center text-cyan-600">{status}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;
