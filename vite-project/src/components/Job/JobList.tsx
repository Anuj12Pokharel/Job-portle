import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBusinessTime } from "react-icons/fa";
import { LiaMoneyCheckSolid } from "react-icons/lia";

interface Job {
  _id: string;
  companyName: string;
  logo?: string;
  position: string;
  location: string;
  expiryDate?: string;
  jobLevel?: string;
  jobType: string;
  experience?: string;
  salary?: string;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#category-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000";

  const buildLogoUrl = (logo?: string) => {
    if (!logo || String(logo) === "undefined" || String(logo) === "null") return "";
    
    // Normalize slashes
    let cleaned = String(logo).replace(/\\/g, "/");
    
    // If it's already a full URL, return it
    if (cleaned.startsWith("http")) return cleaned;
    
    // Ensure it's a relative path starting from uploads/
    const uploadsIndex = cleaned.indexOf("uploads/");
    const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : `uploads/${cleaned.replace(/^\/+/, "")}`;
    
    // Clean up base URL and combine
    const baseUrl = backendBase.replace(/\/+$/, "");
    return `${baseUrl}/${relativePath}`;
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

  const handleCategorySelection = (newCategory: string) => {
    const params = new URLSearchParams();
    if (newCategory) params.append("category", newCategory);
    if (search) params.append("search", search);

    // Navigate smoothly
    navigate(`/?${params.toString()}`, { replace: true });
  };

  const clearFilter = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl text-cyan-600 font-bold text-center sm:text-left">
            {search ? `Search Results for "${search}"` : "Featured Jobs"}
          </h2>
          <div className="h-1 w-20 bg-cyan-500 rounded-full mt-2 hidden sm:block"></div>
        </div>

        <div className="relative w-full sm:w-72" id="category-dropdown">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-cyan-500">
            <Filter size={18} />
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 hover:border-cyan-200 rounded-2xl shadow-sm text-gray-700 font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-50"
          >
            <span className="truncate">
              {category ? `${category}` : "All Categories"}
            </span>
            <svg
              className={`fill-current h-4 w-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden dropdown-enter origin-top animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-72 overflow-y-auto custom-scrollbar px-2 py-2">
                <button
                  onClick={() => {
                    handleCategorySelection("");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3 text-sm rounded-xl transition-colors ${!category ? "bg-cyan-50 text-cyan-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      handleCategorySelection(cat.name);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm rounded-xl transition-colors ${category === cat.name ? "bg-cyan-50 text-cyan-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl shadow-sm border border-white flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-50 flex items-center justify-center rounded-xl border border-dashed border-sky-200 flex-shrink-0">
                      <span className="text-[10px] text-sky-400 font-bold">No Logo</span>
                    </div>
                  )}
                  <div className="">
                    <h1
                      className="font-bold text-base text-gray-800"
                      title={job.position}
                    >
                      {job.position}
                    </h1>
                    <p
                      className="text-gray-600 text-xs"
                      title={job.companyName}
                    >
                      {job.companyName}
                    </p>
                  </div>
                </div>

                {/* Location + Expiry + Experience + Salary Grid */}
                <div className="mt-3 text-gray-500 text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {job.location || "Location..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <FaBusinessTime className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {job.experience || "Experience..."}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 min-w-0 text-red-600 font-medium">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {job.expiryDate
                          ? `${Math.ceil(
                            (new Date(job.expiryDate).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                          )} days left`
                          : "No expiry"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <LiaMoneyCheckSolid className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {job.salary || "Negotiable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Only */}
                <div className="mt-4 flex justify-end items-center">
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
