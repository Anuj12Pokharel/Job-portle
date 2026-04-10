import { useEffect, useState } from "react";
import axios from "axios";

// Tabs for UI
const LEVELS_UI = ["Senior", "Mid", "Junior", "Entry Level", "Fresher"];

// Mapping from UI tab to backend enum
const LEVELS_MAP: Record<string, string> = {
  Senior: "Senior-level",
  Mid: "Mid-level",
  Junior: "Junior",
  "Entry Level": "Entry-level",
  Fresher: "Fresher",
};

interface Job {
  _id: string;
  position: string;
  companyName: string;
  logo?: string;
  jobLevel: string;
}


export default function Jobcard() {
  const [activeLevel, setActiveLevel] = useState("Senior");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
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
    fetchJobs(activeLevel);
  }, [activeLevel]);

  const fetchJobs = async (level: string) => {
    try {
      setLoading(true);
      const backendLevel = LEVELS_MAP[level]; // Map UI tab to backend enum
      const response = await axios.get(
        `${backendBase}/api/jobs/by-level`,
        { params: { level: backendLevel } }
      );
      // Ensure jobs is always an array
      setJobs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 w-full max-w-sm mx-auto lg:mx-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
        Explore Jobs By Level
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
        {LEVELS_UI.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm transition ${activeLevel === level
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-600"
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-400">No jobs found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job._id}
              className="flex items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm"
            >
              <img
                src={buildLogoUrl(job.logo)}
                alt={job.companyName}
                className="w-10 h-10 object-contain flex-shrink-0 rounded-md shadow-sm border border-gray-50"
              />
              <div>
                <p className="font-bold text-sm text-gray-800 leading-tight">
                  {job.position}
                </p>
                <p className="text-xs text-gray-600">
                  {job.companyName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All */}
      <div className="text-center mt-6">
        <a
          href={`/jobs?level=${LEVELS_MAP[activeLevel]}`}
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          View All →
        </a>
      </div>
    </div>

  );
}
