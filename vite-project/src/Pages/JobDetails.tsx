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
        if (!logo) return "";
        const cleaned = String(logo).replace(/\\/g, "/").replace(/^\/+/, "");
        return cleaned.startsWith("http") ? cleaned : `${backendBase}/${cleaned}`;
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
            <div className="max-w-4xl mx-auto">
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
                            <span className="text-gray-800 font-medium">: Not Specified</span>
                        </div>
                        <div className="flex">
                            <span className="w-48 text-gray-500 font-medium shrink-0">Industry</span>
                            <span className="text-gray-800 font-medium">: {job.category}</span>
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
                            <span className="w-48 text-gray-500 font-medium shrink-0">Desired Candidate</span>
                            <span className="text-gray-800 font-medium">: {job.desiredCandidate || "Both"}</span>
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
                            <span className="w-48 text-gray-500 font-medium shrink-0">Vehicle License</span>
                            <span className="text-gray-800 font-medium">: Not Specified</span>
                        </div>
                        <div className="flex">
                            <span className="w-48 text-gray-500 font-medium shrink-0">Two/Four Wheeler</span>
                            <span className="text-gray-800 font-medium">: Not Specified</span>
                        </div>
                        <div className="flex">
                            <span className="w-48 text-gray-500 font-medium shrink-0">Skills</span>
                            <span className="text-gray-800 font-medium">: Not Specified</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm text-justify">
                        {job.description || "No description provided."}
                    </p>
                </div>

                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Key Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        {/* Placeholder logic until backend supports specific fields */}
                        <li>Visit retail outlets, grocery stores, and distributors within assigned areas.</li>
                        <li>Promote company products and ensure proper product placement.</li>
                        <li>Achieve assigned sales targets and contribute to overall business.</li>
                        <li>Build and maintain strong relationships with retailers.</li>
                    </ul>
                </div>

                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Job Specification</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li>Minimum +2 (Intermediate) or equivalent qualification.</li>
                        <li>Prior experience in retail sales will be an advantage.</li>
                        <li>Strong communication and interpersonal skills.</li>
                    </ul>
                </div>

                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Compensation & Benefits</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li>Fixed monthly salary.</li>
                        <li>Daily TADA.</li>
                        <li>Opportunity to work with reputed organization.</li>
                    </ul>
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
        </div>
    );
};

export default JobDetails;
