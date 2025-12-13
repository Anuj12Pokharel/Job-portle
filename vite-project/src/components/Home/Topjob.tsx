import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { FaBusinessTime } from "react-icons/fa";

const Topjob = () => {
  const [jobs, setJobs] = useState([]);

  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://job-portle-backend-fsai.onrender.com";

  const buildLogoUrl = (logo?: string) => {
    if (!logo) return "";
    const cleaned = String(logo).replace(/\\/g, "/").replace(/^\/+/, "");
    return cleaned.startsWith("http") ? cleaned : `${backendBase}/${cleaned}`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "https://job-portle-backend-fsai.onrender.com/api/jobs/get",
        );
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6">
      <h2 className="text-2xl sm:text-3xl text-cyan-600 font-bold mb-4 text-center">
        Top Job
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {jobs
          .slice(-15)
          .reverse()
          .map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex flex-col hover:shadow-lg transition"
            >
              {/* Company Logo + Name */}
              <div className="flex items-center gap-3 sm:gap-4 bg-sky-100 px-2 py-2 rounded-xl">
                {buildLogoUrl(job.logo) ? (
                  <img
                    src={buildLogoUrl(job.logo)}
                    alt={job.companyName}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
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
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{job.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBusinessTime className="w-5 h-5 text-gray-500" />
                    <span>{job.experience || "Experience not specified"}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span>
                      {job.expiryDate
                        ? `${Math.ceil(
                            (new Date(job.expiryDate).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24),
                          )} days left`
                        : "No expiry"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LiaMoneyCheckSolid className="h-5 w-5 text-gray-700" />
                    <span className="  text-gray-500 rounded">
                      {job.salary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Level + Type */}
              <div className="mt-3 flex justify-between ">
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

              {/* =��� View Details Link */}
              <div className="mt-4">
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  View Details G��
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Topjob;
