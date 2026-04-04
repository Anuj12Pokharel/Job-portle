import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LayoutDashboard,
    PlusCircle,
    Briefcase,
    Users,
    Settings,
    LogOut,
    Trash2,
    Edit,
    MapPin,
    DollarSign,
    Download,
    History as HistoryIcon,
    Menu,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

import ApplicationModal from "../components/ApplicationModal";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, post-job, my-jobs, applications
    const [myJobs, setMyJobs] = useState([]);
    const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, rejectedApplicants: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Applicants State
    const [viewApplicantsJobId, setViewApplicantsJobId] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State for Post Job
    const [jobData, setJobData] = useState({
        companyName: "",
        position: "",
        category: "",
        jobLevel: "",
        jobType: "Full-time",
        location: "",
        description: "",
        salary: "",
        experience: "",
        educationLevel: "",
        aboutCompany: "",
        companyWebsite: "",
        noOfOpenings: "",
        industry: "",
        skills: "",
        desiredCandidate: "",
        expiryDate: "",
    });
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyTotal, setHistoryTotal] = useState(0);
    const [historyFilter, setHistoryFilter] = useState<string>("all");

    useEffect(() => {
        const loadMyJobs = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                // Initial load of jobs
                const res = await axios.get(`${API_BASE_URL}/api/jobs/myjobs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMyJobs(res.data);
                setStats(prev => ({ ...prev, totalJobs: res.data.length }));
            } catch (err) {
                console.error(err);
                // Check if it's an approval status error
                const errorMessage = err.response?.data?.message;
                if (errorMessage && (errorMessage.includes("pending approval") || errorMessage.includes("rejected"))) {
                    alert(errorMessage + "\n\nPlease contact the Super Admin for approval.");
                }
            }
            setLoading(false);
        };
        const fetchLatestProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/employer/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data) {
                    const latestUser = res.data;
                    setJobData(prev => ({
                        ...prev,
                        companyName: latestUser.companyName || prev.companyName,
                        location: latestUser.companyLocation || prev.location,
                        companyWebsite: latestUser.companyWebsite || prev.companyWebsite,
                        aboutCompany: latestUser.aboutCompany || prev.aboutCompany,
                    }));
                    // Keep localStorage in sync
                    localStorage.setItem("user", JSON.stringify(latestUser));
                }
            } catch (err) {
                console.error("Failed to fetch latest profile for auto-fill", err);
            }
        };

        loadMyJobs();
        fetchLatestProfile();

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user) {
                    setJobData(prev => ({
                        ...prev,
                        companyName: user.companyName || "",
                        location: user.companyLocation || "",
                        companyWebsite: user.companyWebsite || "",
                        aboutCompany: user.aboutCompany || "",
                    }));
                }
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const fetchMyJobs = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/Employeer-Login");
            return;
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/jobs/myjobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyJobs(res.data);

            // Calculate statistics
            let totalApplicants = 0;
            let rejectedApplicants = 0;

            // Fetch applicants for each job to get counts
            const applicantPromises = res.data.map((job: any) =>
                axios.get(`${API_BASE_URL}/api/jobs/${job._id}/applicants`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => ({ data: [] }))
            );

            const applicantResults = await Promise.all(applicantPromises);
            applicantResults.forEach((result: any) => {
                if (result.data) {
                    totalApplicants += result.data.length;
                    rejectedApplicants += result.data.filter((app: any) => app.status === 'rejected').length;
                }
            });

            setStats({
                totalJobs: res.data.length,
                totalApplicants,
                rejectedApplicants
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
            setLoading(false);
        }
    };

    const fetchApplicants = async (jobId: string) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}/applicants`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplicants(res.data);
            setViewApplicantsJobId(jobId);
            setActiveTab("applications"); // Switch view context conceptually
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch applicants", err);
            alert("Failed to fetch applicants");
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE_URL}/api/jobs/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMyJobs();
            alert("Job deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete job");
        }
    };

    const handleEditJob = (job: any) => {
        // Populate form with job data
        setJobData({
            companyName: job.companyName || "",
            position: job.position || "",
            category: job.category || "",
            jobLevel: job.jobLevel || "",
            jobType: job.jobType || "Full-time",
            location: job.location || "",
            description: job.description || "",
            salary: job.salary || "",
            experience: job.experience || "",
            educationLevel: job.educationLevel || "",
            aboutCompany: job.aboutCompany || "",
            companyWebsite: job.companyWebsite || "",
            noOfOpenings: job.noOfOpenings || "",
            industry: job.industry || "",
            skills: job.skills || "",
            expiryDate: job.expiryDate ? new Date(job.expiryDate).toISOString().split('T')[0] : "",
            desiredCandidate: job.desiredCandidate || ""
        });
        setEditingJobId(job._id);
        setActiveTab("post-job");
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        Object.entries(jobData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, String(value));
            }
        });

        try {
            if (editingJobId) {
                // Update existing job
                await axios.put(`${API_BASE_URL}/api/jobs/update/${editingJobId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                });
                alert("Job Updated Successfully!");
                setEditingJobId(null);
            } else {
                // Create new job
                await axios.post(`${API_BASE_URL}/api/jobs/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                });
                alert("Job Posted Successfully!");
            }
            if (activeTab === 'history') {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/history/my-history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHistory(res.data.history || []);
                    setHistoryTotal(res.data.total || 0);
                } catch (err) {
                    console.error("Failed to fetch history", err);
                }
            } else if (activeTab === 'my-jobs' || activeTab === 'dashboard') {
                fetchMyJobs();
            }
            setJobData({
                companyName: "", position: "", category: "", jobLevel: "", jobType: "Full-time",
                location: "", description: "", salary: "", experience: "",
                educationLevel: "", aboutCompany: "", companyWebsite: "",
                noOfOpenings: "", industry: "", skills: "",
                desiredCandidate: "", expiryDate: "",
            });
            // Re-fill company fields from localStorage after reset
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    if (user) setJobData(prev => ({ 
                        ...prev, 
                        companyName: user.companyName || "", 
                        location: user.companyLocation || "", 
                        companyWebsite: user.companyWebsite || "",
                        aboutCompany: user.aboutCompany || ""
                    }));
                } catch (e) { }
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to post job";

            // Check if it's an approval status error
            if (msg.includes("pending approval") || msg.includes("rejected")) {
                alert(msg + "\n\nPlease contact the Super Admin for approval.");
            } else {
                alert(msg);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    const openApplicationModal = (application: any) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        // Update local state
        setApplicants(prev => prev.map(app =>
            app._id === id ? { ...app, status: newStatus } : app
        ));
    };

    const handleDownloadCV = async (resumePath: string) => {
        if (!resumePath) {
            alert("No CV available");
            return;
        }
        // Normalize path
        const path = resumePath.replace(/\\/g, "/");
        const url = path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Extract filename from path or default to resume
            const filename = path.split('/').pop() || 'resume';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to opening in new tab if direct download fails
            window.open(url, "_blank");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                application={selectedApplication}
                onStatusUpdate={handleStatusUpdate}
            />

            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 text-white flex flex-col fixed h-full transition-all duration-300 z-20 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        Employer Hub
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => { setActiveTab("dashboard"); setViewApplicantsJobId(null); }} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </button>
                    <button onClick={() => { setActiveTab("post-job"); setViewApplicantsJobId(null); }} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'post-job' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <PlusCircle className="w-5 h-5 mr-3" /> Post New Job
                    </button>
                    <button onClick={() => window.location.assign("/employer-profile-settings")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${location.pathname === '/employer-profile-settings' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> Company Profile
                    </button>
                    <button onClick={() => { setActiveTab("my-jobs"); setViewApplicantsJobId(null); }} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'my-jobs' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> My Jobs
                    </button>
                    <button onClick={() => {
                        setActiveTab("history"); setViewApplicantsJobId(null);
                        // Fetch history immediately when tab is clicked
                        const token = localStorage.getItem("token");
                        if (token) {
                            axios.get(`${API_BASE_URL}/api/history/my-history`, { headers: { Authorization: `Bearer ${token}` } })
                                .then(res => {
                                    setHistory(res.data.history || []);
                                    setHistoryTotal(res.data.total || 0);
                                })
                                .catch(err => console.error(err));
                        }
                    }} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <HistoryIcon className="w-5 h-5 mr-3" /> History
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 transition-all">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-3xl font-bold text-gray-800 capitalize">
                            {viewApplicantsJobId ? "Job Applicants" : activeTab.replace("-", " ")}
                        </h2>
                    </div>
                    {/* Profile section removed as per request */}
                </header>

                {/* Dashboard View */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Total Jobs Posted</h3>
                                <Briefcase className="text-teal-500 w-6 h-6" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalJobs}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Total Applicants</h3>
                                <Users className="text-blue-500 w-6 h-6" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalApplicants}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Rejected Applicants</h3>
                                <Users className="text-red-500 w-6 h-6" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{stats.rejectedApplicants}</p>
                        </div>
                    </div>
                )}

                {/* My Jobs View */}
                {activeTab === "my-jobs" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">Loading...</div>
                        ) : myJobs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">You haven't posted any jobs yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Position</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Location</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Posted</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {myJobs.map((job: any) => (
                                            <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{job.position}</td>
                                                <td className="px-6 py-4 text-gray-500">{job.location}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                        {job.jobType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <button
                                                        onClick={() => fetchApplicants(job._id)}
                                                        className="px-3 py-1 bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100 text-sm font-medium transition"
                                                    >
                                                        View Applicants
                                                    </button>
                                                    <button onClick={() => handleEditJob(job)} className="text-blue-500 hover:text-blue-700 p-2" title="Edit Job">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:text-red-700 p-2" title="Delete Job">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Applications List View */}
                {activeTab === "applications" && viewApplicantsJobId && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <button onClick={() => setActiveTab("my-jobs")} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                                &larr; Back to Jobs
                            </button>
                            <span className="text-gray-500 text-sm">{applicants.length} Applicants found</span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center">Loading...</div>
                        ) : applicants.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                <Users className="w-12 h-12 text-gray-300 mb-3" />
                                <p>No applicants for this job yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Applicant</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Applied Date</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {applicants.map((app: any) => (
                                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{app.user?.fullName}</td>
                                                <td className="px-6 py-4 text-gray-500">{app.user?.email}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium 
                                                        ${app.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                app.status === 'hiring-process' ? 'bg-purple-100 text-purple-700' :
                                                                    app.status === 'viewing' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-gray-100 text-gray-700'}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => openApplicationModal(app)} className="text-teal-600 hover:text-teal-800 font-medium text-sm mr-3">
                                                        View Application
                                                    </button>
                                                    {app.resume && (
                                                        <button
                                                            onClick={() => handleDownloadCV(app.resume)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                                            title="Download CV"
                                                        >
                                                            <Download className="w-4 h-4" /> Download
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}


                {/* Post Job View */}
                {activeTab === "post-job" && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingJobId ? "Edit Job" : "Post New Job"}</h3>
                        <form onSubmit={handlePostJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        value={jobData.companyName}
                                        readOnly
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Auto-filled from your company profile</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position / Job Title</label>
                                    <input type="text" value={jobData.position} onChange={e => setJobData({ ...jobData, position: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                                    <input
                                        type="text"
                                        value={jobData.location}
                                        readOnly
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Auto-filled from your company profile</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                                    <input
                                        type="text"
                                        value={jobData.companyWebsite}
                                        readOnly
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Auto-filled from your company profile</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                    <select
                                        value={jobData.jobType}
                                        onChange={e => setJobData({ ...jobData, jobType: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        required
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={jobData.category}
                                        onChange={e => setJobData({ ...jobData, category: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. Software Development"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Level</label>
                                    <select
                                        value={jobData.jobLevel}
                                        onChange={e => setJobData({ ...jobData, jobLevel: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="">Select Job Level</option>
                                        <option value="Entry-level">Entry-level</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Mid-level">Mid-level</option>
                                        <option value="Senior-level">Senior-level</option>
                                        <option value="Executive">Executive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                                    <input type="text" value={jobData.salary} onChange={e => setJobData({ ...jobData, salary: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Openings</label>
                                    <input type="number" value={jobData.noOfOpenings} onChange={e => setJobData({ ...jobData, noOfOpenings: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <input type="text" value={jobData.industry} onChange={e => setJobData({ ...jobData, industry: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                                    <input type="text" value={jobData.educationLevel} onChange={e => setJobData({ ...jobData, educationLevel: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Required)</label>
                                    <input type="text" value={jobData.experience} onChange={e => setJobData({ ...jobData, experience: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input type="date" value={jobData.expiryDate} onChange={e => setJobData({ ...jobData, expiryDate: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About Company</label>
                                    <input type="text" value={jobData.aboutCompany} onChange={e => setJobData({ ...jobData, aboutCompany: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                <textarea rows={5} value={jobData.description} onChange={e => setJobData({ ...jobData, description: e.target.value })} className="w-full border rounded-lg px-4 py-2"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
                                {editingJobId ? "Update Job" : "Post Job"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">Activity History</h2>
                        </div>
                        <div className="p-6">
                            {/* Filter Tabs */}
                            <div className="flex gap-2 mb-4 border-b">
                                <button
                                    onClick={() => setHistoryFilter("all")}
                                    className={`px-4 py-2 font-medium transition-colors ${historyFilter === "all"
                                        ? "border-b-2 border-teal-500 text-teal-600"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    All History
                                </button>
                                <button
                                    onClick={() => setHistoryFilter("application")}
                                    className={`px-4 py-2 font-medium transition-colors ${historyFilter === "application"
                                        ? "border-b-2 border-teal-500 text-teal-600"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    Applicant History
                                </button>
                                <button
                                    onClick={() => setHistoryFilter("job")}
                                    className={`px-4 py-2 font-medium transition-colors ${historyFilter === "job"
                                        ? "border-b-2 border-teal-500 text-teal-600"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    Job History
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {history.filter(record => historyFilter === "all" || record.entityType === historyFilter).length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No {historyFilter !== "all" ? historyFilter : ""} history records found</td></tr>
                                        ) : (
                                            history.filter(record => historyFilter === "all" || record.entityType === historyFilter).map((record: any) => (
                                                <tr key={record._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(record.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.entityType === 'job' ? 'bg-blue-100 text-blue-800' :
                                                            record.entityType === 'application' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {record.entityType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.action === 'created' ? 'bg-green-100 text-green-800' :
                                                            record.action === 'deleted' ? 'bg-red-100 text-red-800' :
                                                                record.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                                                                    record.action === 'accepted' ? 'bg-teal-100 text-teal-800' :
                                                                        record.action === 'rejected' ? 'bg-orange-100 text-orange-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {record.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {record.details || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {record.performedBy?.fullName || record.performedBy?.email || 'System'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {history.length > 0 && (
                                    <div className="mt-4 text-sm text-gray-600">Total: {historyTotal} records</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
};

export default AdminDashboard;
