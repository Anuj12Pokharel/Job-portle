import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Layers,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaTwitter,
  FaFacebookMessenger,
  FaCopy,
} from "react-icons/fa";

interface Job {
  _id: string;
  companyName: string;
  logo?: string;
  position: string;
  category: string;
  location: string;
  jobLevel: string;
  salary: string;
  educationLevel: string;
  desiredCandidate: string;
  experience: string;
  expiryDate: string;
  description: string;
  aboutCompany?: string;
  companyWebsite?: string;
  jobType: string;
  noOfOpenings?: string;
  industry?: string;
  skills?: string;
  additionalRequirements?: string;
  additionalInformation?: string;
}

/** Single row for the detail grid */
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex">
    <span className="w-48 text-gray-500 font-medium shrink-0">{label}</span>
    <span className="text-gray-800 font-medium">: {value || "Not Specified"}</span>
  </div>
);

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://job-portle-backend-fsai.onrender.com";

  const buildLogoUrl = (logo?: string) => {
    if (!logo || String(logo) === "undefined" || String(logo) === "null") return "";
    const cleaned = String(logo).replace(/\\/g, "/");
    if (cleaned.startsWith("http")) return cleaned;
    const uploadsIndex = cleaned.indexOf("uploads/");
    const relativePath =
      uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
    return `${backendBase}/${relativePath}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Job not found or error loading details.");
      } finally {
        setLoading(false);
      }
    };

    const checkSavedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${backendBase}/api/jobs/user/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedIds = res.data.map((j: any) => j._id);
        if (savedIds.includes(id)) setIsSaved(true);
      } catch (err) {
        console.error("Failed to check saved status", err);
      }
    };

    fetchJob();
    checkSavedStatus();
  }, [id, backendBase]);

  const handleApply = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Jobseeker-Login", { state: { from: `/apply-job/${job?._id}` } });
    } else {
      navigate(`/apply-job/${job?._id}`);
    }
  };

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !job) {
      navigate("/Jobseeker-Login", { state: { from: `/jobs/${job?._id}` } });
      return;
    }
    try {
      const res = await axios.post(
        `${backendBase}/api/jobs/save/${job._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update save status");
    }
  };

  // ── Loading / Error states ──
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500 text-lg">Loading job details…</div>
      </div>
    );
  }
  if (error || !job) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        {error || "Job not found"}
      </div>
    );
  }

  // Compute days left
  const daysLeft = job.expiryDate
    ? Math.ceil((new Date(job.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const expiryDisplay = (() => {
    if (!job.expiryDate) return "N/A";
    const formatted = new Date(job.expiryDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const status =
      daysLeft !== null && daysLeft > 0 ? `${daysLeft} days left` : "Expired";
    return (
      <>
        {formatted}{" "}
        <span className={`font-normal ${daysLeft !== null && daysLeft > 0 ? "text-green-600" : "text-red-500"}`}>
          ({status})
        </span>
      </>
    );
  })();

  const websiteLink = job.companyWebsite ? (
    <a
      href={job.companyWebsite.startsWith("http") ? job.companyWebsite : `https://${job.companyWebsite}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {job.companyWebsite}
    </a>
  ) : null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Main Column ─── */}
        <div className="lg:col-span-2">


          {/* Position Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
            {job.position}
          </h1>


          {/* ── Job Information ── */}
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Job Information</h3>
            <div className="grid grid-cols-1 gap-y-3 text-sm">
              <DetailRow label="No. of Openings" value={job.noOfOpenings} />
              <DetailRow label="Category" value={job.category} />
              <DetailRow label="Job Level" value={job.jobLevel || "Mid Level"} />
              <DetailRow label="Job Type" value={job.jobType} />
              <DetailRow label="Salary" value={job.salary || "Negotiable"} />
              <DetailRow label="Education Level" value={job.educationLevel || "Bachelor"} />
              <DetailRow label="Experience" value={job.experience || "Not Mentioned"} />
              <DetailRow label="Application Deadline" value={expiryDisplay} />
            </div>
          </div>

          {/* ── Job Description ── */}
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm text-justify">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* ── Desired Candidate ── */}
          {job.desiredCandidate && (
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Desired Candidate Profile</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm text-justify">
                {job.desiredCandidate}
              </p>
            </div>
          )}

          {/* ── Additional Information ── */}
          {job.additionalInformation && (
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm text-justify">
                {job.additionalInformation}
              </p>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleApply}
                disabled={daysLeft !== null && daysLeft <= 0}
                className={`px-6 py-2 rounded transition font-medium text-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm ${
                  daysLeft !== null && daysLeft <= 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {daysLeft !== null && daysLeft <= 0 ? "Job Expired" : "Apply Now"}
              </button>
              <button
                className={`px-6 py-2 rounded transition font-medium text-sm flex items-center justify-center gap-2 w-full sm:w-auto border ${
                  isSaved
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
                onClick={handleSaveToggle}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>

            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="font-medium mr-1 text-gray-700">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-blue-600 transition"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this job: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-green-500 transition"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-blue-700 transition"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this job: ${job.position} at ${job.companyName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-800 transition"
                title="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href={`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-blue-500 transition md:hidden"
                title="Messenger"
              >
                <FaFacebookMessenger size={16} />
              </a>
              {/* Desktop Messenger (Fallthrough to FB share as direct send needs app_id) */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-blue-500 transition hidden md:block"
                title="Messenger"
              >
                <FaFacebookMessenger size={16} />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied to clipboard!");
                }}
                className="text-gray-800 hover:text-blue-600 transition"
                title="Copy Link"
              >
                <FaCopy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Sidebar ─── */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Company Profile Card */}
          <div className="bg-yellow-100 rounded-lg p-6 shadow-sm border border-yellow-200 text-gray-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-600" />
              Company Profile
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-lg">{job.companyName}</p>
              {job.industry && (
                <p>
                  <span className="font-medium text-gray-700">Industry:</span> {job.industry}
                </p>
              )}
              {job.location && (
                <p>
                  <span className="font-medium text-gray-700">Location:</span> {job.location}
                </p>
              )}
              {job.aboutCompany && (
                <div className="mb-4">
                  <span className="font-medium text-gray-700 block mb-1">About Company:</span>
                  <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                    {job.aboutCompany}
                  </p>
                </div>
              )}
              {job.companyWebsite && (
                <p>
                  <span className="font-medium text-gray-700 block mb-1">Website:</span>
                  <a
                    href={
                      job.companyWebsite.startsWith("http")
                        ? job.companyWebsite
                        : `https://${job.companyWebsite}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {job.companyWebsite}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          {(job.skills || job.additionalRequirements) && (
            <div className="bg-yellow-50 rounded-lg p-6 shadow-sm border border-yellow-200 text-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-yellow-600" />
                Additional Information
              </h3>
              <div className="space-y-3 text-sm">
                {job.skills && (
                  <div>
                    <span className="font-medium text-gray-700 block mb-1">Skills Required:</span>
                    <p className="text-gray-600">{job.skills}</p>
                  </div>
                )}
                {job.additionalRequirements && (
                  <div>
                    <span className="font-medium text-gray-700 block mb-1">
                      Other Requirements:
                    </span>
                    <p className="text-gray-600 whitespace-pre-line">
                      {job.additionalRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
