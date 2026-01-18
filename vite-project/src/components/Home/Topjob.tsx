import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { FaBusinessTime } from "react-icons/fa";

const Topjob = ({ category, search }: { category?: string; search?: string }) => {
  const [jobs, setJobs] = useState<any[]>([]); // Use appropriate type if available, else any[]
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);

        const url = `${backendBase}/api/jobs/get${params.toString() ? `?${params.toString()}` : ""}`;

        const res = await axios.get(url);
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, [category, search, backendBase]);

  const sortedJobs = [...jobs]
   .filter((job) => {
    if (!job.expiryDate) return true; // Keep jobs with no expiry
    const expiry = new Date(job.expiryDate);
    expiry.setHours(23, 59, 59, 999); // End of the expiry day
    return expiry.getTime() > Date.now(); // Only include jobs that are not expired
  })
  .sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
   <div className="px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">

    <h2 className="text-2xl sm:text-3xl text-cyan-600 font-bold text-center sm:text-left">
      {search ? `Top Jobs - Search Results for "${search}"` : "Top Jobs"}
    </h2>

    <div className="flex items-center gap-2 justify-center sm:justify-start">
      <span className="text-sm text-gray-600 font-medium">Sort by:</span>
      <select
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(e.target.value as "newest" | "oldest")
        }
        className="border border-gray-300 rounded-md px-2 py-1 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>

  </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {sortedJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col hover:shadow-lg transition"
          >
            {/* Company Logo + Name */}
            <div className="flex items-center gap-3 sm:gap-4 bg-sky-100 px-2 py-2 rounded-xl">
              {buildLogoUrl(job.logo) ? (
                <img
                  src={buildLogoUrl(job.logo)}
                  alt={job.companyName}
                  className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded"
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
    ? (() => {
        const expiry = new Date(job.expiryDate);
        // Set expiry to end of the day
        expiry.setHours(23, 59, 59, 999);

        const diff = expiry.getTime() - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return "Expired";
        if (days === 0) return "Expires Today";
        return `${days} days left`;
      })()
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

           {/* Job Level + Type + View Details */}
<div className="mt-3 flex justify-between items-center">
  <div className="flex space-x-2">
    {job.jobLevel && (
      <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">
        {job.jobLevel}
      </span>
    )}
    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
      {job.jobType}
    </span>
  </div>

  <Link
    to={`/jobs/${job._id}`}
    className="text-blue-600 text-sm font-semibold hover:underline"
  >
    View Details
  </Link>
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topjob;
