import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MapPin,
    Calendar,
    Briefcase,
    Layers,
    GraduationCap,
    Users,
    Clock,
    DollarSign,
    Monitor,
    Heart,
    Share2,
    Bookmark,
    BookmarkCheck,
    Building2,
} from "lucide-react";
import {
    FaFacebookF,
    FaWhatsapp,
    FaLinkedinIn,
    FaTwitter,
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
    vehicleLicense?: string;
    twoFourWheeler?: string;
    skills?: string;
}

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
        const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
        return `${backendBase}/${relativePath}`;
    };

    useEffect(() => {
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
                    headers: { Authorization: `Bearer ${token}` }
                });
                const savedIds = res.data.map((j: any) => j._id);
                if (savedIds.includes(id)) {
                    setIsSaved(true);
                }
            } catch (err) {
                console.error("Failed to check saved status", err);
            }
        };

        if (id) {
            fetchJob();
            checkSavedStatus();
        }
    }, [id, backendBase]);

    const handleApply = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // User not logged in -> redirect to login, passing current location to redirect back
            // Redirect to Jobseeker Login, storing the intended destination
            navigate("/Jobseeker-Login", { state: { from: `/apply-job/${job?._id}` } });
        } else {
            // User logged in -> go to apply page
            navigate(`/apply-job/${job?._id}`);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    if (error || !job)
        return (
            <div className="text-center py-20 text-red-500 text-xl">
                {error || "Job not found"}
            </div>
        );

    const daysLeft = job.expiryDate
        ? Math.ceil(
            (new Date(job.expiryDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
        : 0;

    return (
        <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-sky-50 rounded-md p-6 mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            {buildLogoUrl(job.logo) ? (
                                <img
                                    src={buildLogoUrl(job.logo)}
                                    alt={job.companyName}
                                    className="w-full h-full object-contain p-1"
                                />
                            ) : (
                                <div className="font-bold text-gray-400 text-xs">Logo</div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {job.companyName}
                            </h2>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                        {job.position}
                    </h1>

                    <div className="mb-8 border-b border-gray-200 pb-8">
                        <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">No. of Openings</span>
                                <span className="text-gray-800 font-medium">: {job.noOfOpenings || "Not Specified"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Industry</span>
                                <span className="text-gray-800 font-medium">: {job.industry || "Not Specified"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Category</span>
                                <span className="text-gray-800 font-medium">: {job.category}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Location</span>
                                <span className="text-gray-800 font-medium">: {job.location}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Job Level</span>
                                <span className="text-gray-800 font-medium">: {job.jobLevel || "Mid Level"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Salary</span>
                                <span className="text-gray-800 font-medium">: {job.salary || "Negotiable"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Education Level</span>
                                <span className="text-gray-800 font-medium">: {job.educationLevel || "Bachelor"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Company Name</span>
                                <span className="text-gray-800 font-medium">: {job.companyName || "Not Specified"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Experience</span>
                                <span className="text-gray-800 font-medium">: {job.experience || "Not Mentioned"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Expiry date</span>
                                <span className="text-gray-800 font-medium">
                                    : {job.expiryDate
                                        ? new Date(job.expiryDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
                                        : "N/A"}{" "}
                                    <span className="text-gray-500 font-normal">({daysLeft > 0 ? `${daysLeft} days left` : "Expired"})</span>
                                </span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Company Address</span>
                                <span className="text-gray-800 font-medium">: {job.location || "Not Specified"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-48 text-gray-500 font-medium shrink-0">Company Website</span>
                                <span className="text-gray-800 font-medium">
                                    : {job.companyWebsite
                                        ? <a href={job.companyWebsite.startsWith("http") ? job.companyWebsite : `https://${job.companyWebsite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{job.companyWebsite}</a>
                                        : "Not Specified"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 border-b border-gray-200 pb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm text-justify">
                            {job.description || "No description provided."}
                        </p>
                    </div>








                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleApply}
                                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition font-medium text-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                            >
                                Apply Now
                            </button>
                            <button
                                className={`px-6 py-2 rounded transition font-medium text-sm flex items-center justify-center gap-2 w-full sm:w-auto border ${isSaved
                                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                                    }`}
                                onClick={async () => {
                                    const token = localStorage.getItem("token");
                                    if (!token) {
                                        navigate("/Jobseeker-Login", { state: { from: `/jobs/${job._id}` } });
                                        return;
                                    }
                                    try {
                                        const res = await axios.post(`${backendBase}/api/jobs/save/${job._id}`, {}, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setIsSaved(res.data.isSaved);
                                        // alert(res.data.message); // Optional: remove alert for smoother UX
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to update save status");
                                    }
                                }}
                            >
                                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                                {isSaved ? "Saved" : "Save Job"}
                            </button>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <span className="font-medium mr-1 text-gray-700">Share:</span>
                            <a href="#" className="text-gray-800 hover:text-blue-600 transition">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" className="text-gray-800 hover:text-green-500 transition">
                                <FaWhatsapp size={16} />
                            </a>
                            <a href="#" className="text-gray-800 hover:text-blue-700 transition">
                                <FaLinkedinIn size={16} />
                            </a>
                            <a href="#" className="text-gray-800 hover:text-gray-800 transition">
                                <FaTwitter size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Company Profile in Yellow */}
                    <div className="bg-yellow-100 rounded-lg p-6 shadow-sm border border-yellow-200 text-gray-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-yellow-600" />
                            Company Profile
                        </h3>
                        <div className="space-y-3 text-sm">
                            <p className="font-semibold text-lg">{job.companyName}</p>
                            {job.industry && (
                                <p><span className="font-medium text-gray-700">Industry:</span> {job.industry}</p>
                            )}
                            {job.location && (
                                <p><span className="font-medium text-gray-700">Location:</span> {job.location}</p>
                            )}
                            {job.companyWebsite && (
                                <p>
                                    <span className="font-medium text-gray-700 block mb-1">Website:</span>
                                    <a
                                        href={job.companyWebsite.startsWith("http") ? job.companyWebsite : `https://${job.companyWebsite}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {job.companyWebsite}
                                    </a>
                                </p>
                            )}
                            {job.aboutCompany && (
                                <div className="mt-4 pt-4 border-t border-yellow-200">
                                    <h4 className="font-semibold mb-2">About Us</h4>
                                    <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">{job.aboutCompany}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    {(job.skills || job.vehicleLicense || job.twoFourWheeler) && (
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
                                {job.vehicleLicense && (
                                    <div>
                                        <span className="font-medium text-gray-700 block mb-1">Vehicle License:</span>
                                        <p className="text-gray-600">{job.vehicleLicense}</p>
                                    </div>
                                )}
                                {job.twoFourWheeler && (
                                    <div>
                                        <span className="font-medium text-gray-700 block mb-1">Vehicle Type:</span>
                                        <p className="text-gray-600">{job.twoFourWheeler}</p>
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
