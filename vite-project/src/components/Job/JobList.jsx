import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";



export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs/get");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
   <div className="p-6">
    
     
         <h2 className="text-3xl text-cyan-600 font-bold mb-4 text-center">Featured Jobs</h2>

      <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.slice(-6).reverse().map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md p-2  flex flex-col hover:shadow-lg transition"
          >
            {/* Company Logo + Name */}
            <div className="flex items-center space-x-4  bg-sky-100 px-0  py-1 rounded-xl ">
              {job.logo ? (
                <img
                  src={`http://localhost:3000/${job.logo}`}
                  alt={job.companyName}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-sm text-gray-500">No Logo</span>
                </div>
              )}
              <div>
                 <h1 className="font-semibold">{job.companyName}</h1>
                <p className="text-gray-500 text-sm">{job.position}</p>
               
              </div>
            </div>

            {/* Location + Expiry */}
            <div className="mt-3 text-gray-600 text-sm space-y-2">
  {/* Location */}
  <div className="flex items-center gap-1">
    <MapPin className="w-5 h-5 text-gray-500" />
    <span>{job.location || "Location not specified"}</span>
  </div>

  {/* Expiry Date */}
  <div className="flex items-center gap-1">
    <Calendar className="w-5 h-5 text-gray-500" />
    <span>
      {job.expiryDate
        ? `${Math.ceil(
            (new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
          )} days left`
        : "No expiry"}
    </span>
  </div>
</div>

            {/* Job Level + Type */}
            <div className="mt-3 flex space-x-2">
              {job.jobLevel && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">
                  {job.jobLevel}
                </span>
              )}
              <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                {job.jobType}
              </span>
            </div>
          </div>
        ))}
      </div>
     </div>
    
   
  );
}
