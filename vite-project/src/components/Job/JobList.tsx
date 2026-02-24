import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Job {
  _id: string;
  companyName: string;
  logo?: string;
  position: string;
  location: string;
  expiryDate?: string;
  jobLevel?: string;
  jobType: string;
}

interface Category {
  name: string;
  count: number;
}

export default function JobList({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://job-portle-backend-fsai.onrender.com";

  const buildLogoUrl = (logo?: string) => {
    if (!logo || String(logo) === "undefined" || String(logo) === "null") return "";
    const cleaned = String(logo).replace(/\\/g, "/");
    // If it's already a full http URL, use it directly
    if (cleaned.startsWith("http")) return cleaned;
    // Extract the relative part starting from 'uploads/'
    const uploadsIndex = cleaned.indexOf("uploads/");
    const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
    return `${backendBase}/${relativePath}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/jobs/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [backendBase]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let url = `${backendBase}/api/jobs/get?`;
        const params = new URLSearchParams();

        if (category) params.append("category", category);
        if (search) params.append("search", search);
        // Only show featured jobs unless searching
        if (!search && !category) {
          params.append("featured", "true");
        }
        // Add cache buster
        params.append("_t", String(Date.now()));

        const res = await axios.get(url + params.toString());
        console.log("JobList - Fetched jobs:", res.data);
        console.log("JobList - Total jobs:", res.data.length);
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, [category, search, backendBase]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams();
    if (newCategory) params.append("category", newCategory);
    if (search) params.append("search", search);

    navigate(`/?${params.toString()}`);
  };

  const clearFilter = () => {
    navigate("/");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl text-cyan-600 font-bold mb-4 sm:mb-0 text-center sm:text-left">
          {search ? `Search Results for "${search}"` : "Featured Jobs"}
        </h2>

        <div className="relative inline-block w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Filter size={18} />
          </div>
          <select
            value={category || ""}
            onChange={handleCategoryChange}
            className="block w-full pl-10 pr-4 py-2 bg-white border border-gray-300 hover:border-gray-400 px-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline transition"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-lg">No jobs found matching your criteria.</p>
          <button
            onClick={clearFilter}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {jobs
            .filter((job) => {
              // Filter out expired jobs
              if (!job.expiryDate) return true; // Keep jobs with no expiry
              const expiry = new Date(job.expiryDate);
              expiry.setHours(23, 59, 59, 999);
              return expiry.getTime() > Date.now(); // Only include active jobs
            })
            .slice(-6)
            .reverse()
            .map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex flex-col hover:shadow-lg transition border border-transparent hover:border-blue-100"
              >
                {/* Company Logo + Name */}
                <div className="flex items-center gap-3 sm:gap-4 bg-sky-50 px-2 py-2 rounded-xl">
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
                  <div className="overflow-hidden">
                    <h1
                      className="font-semibold text-gray-800 truncate"
                      title={job.companyName}
                    >
                      {job.companyName}
                    </h1>
                    <p
                      className="text-gray-500 text-sm truncate"
                      title={job.position}
                    >
                      {job.position}
                    </p>
                  </div>
                </div>

                {/* Location + Expiry */}
                <div className="mt-3 text-gray-600 text-sm space-y-2">
                  {/* Location */}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">
                      {job.location || "Location not specified"}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {job.expiryDate
                        ? `${Math.ceil(
                          (new Date(job.expiryDate).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                        )} days left`
                        : "No expiry"}
                    </span>
                  </div>
                </div>

                {/* Job Level + Type + View Details */}
                <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {job.jobLevel && (
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-medium rounded-full border border-blue-100">
                        {job.jobLevel}
                      </span>
                    )}
                    <span className="bg-green-50 text-green-700 px-2.5 py-1 text-xs font-medium rounded-full border border-green-100">
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
      )}
    </div>
  );
}
