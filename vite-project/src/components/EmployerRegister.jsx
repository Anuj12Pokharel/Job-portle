
import React, { useState } from "react";
import axios from "axios";
import register from '../assets/register.png'
import { useNavigate } from "react-router-dom";

const EmployerRegister = () => {
  const [formData, setFormData] = useState({
   companyName:"",
      companyLocation:"",
      email:"",
      mobileNumber:"",
      password:"",
      confirmPassword:"",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 
   const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    setError("");
      setLoading(true);
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://job-portle-backend-fsai.onrender.com/api/admin/register",formData,
       
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Registration successful!");
       setFormData({
        companyName: "",
        companyLocation: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
      });
        navigate("/Employeer-Login"); // change "/login" if your route is different
       
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full md:w-1/3 flex py-14">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-center text-teal-500">Create your free Employeer account  </h2>
        <p className="mb-4 text-cyan-600 text-center">
        Create an account, fill out your profile, and apply for jobs at 
no cost.
        </p>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500 text-center  text-2xl">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
         

          <input
            type="text"
            name="companyLocation"
            placeholder="companyLocation"
            value={formData.companyLocation}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
            <input
            type="text"
            name="mobileNumber"
            placeholder="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
          
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <div className=" flex justify-center">
            
             <button
            type="submit"
             disabled={loading}
            className=" items-center  w-1/2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-800"
          >
            {loading ? "Creating..." : "Create jobseeker account"} 
          </button>
         
          </div>
           <p className="text-balck font-bold text-center"> Already have jobseeker account? Login  
Or login with google </p>

        
        </form>
      </div>
      </div>
       <div className="w-full md:w-1/2 hidden md:flex py-14 px-4">
        <img
          src={register}
          alt="Register Illustration"
          className="w-full h-full object-cover rounded-lg "
        />

 </div>
      
    </div>
  );
};



export default EmployerRegister