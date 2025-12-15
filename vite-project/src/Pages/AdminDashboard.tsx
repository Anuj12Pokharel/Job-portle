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
    DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, post-job, my-jobs, applications
    const [myJobs, setMyJobs] = useState([]);
    const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Form State for Post Job
    const [jobData, setJobData] = useState({
        companyName: "",
        position: "",
        category: "",
        jobType: "Full-time",
        location: "",
        description: "",
        salary: "",
        experience: "",
        educationLevel: "",
        aboutCompany: "",
        companyWebsite: ""
    });
    const [logo, setLogo] = useState<File | null>(null);

    useEffect(() => {
        fetchMyJobs();
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
            setStats({ totalJobs: res.data.length, totalApplicants: 0 }); // Todo: fetch applicants count
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
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

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        Object.entries(jobData).forEach(([key, value]) => formData.append(key, value));
        if (logo) formData.append("logo", logo);

        try {
            await axios.post(`${API_BASE_URL}/api/jobs/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            alert("Job Posted Successfully!");
            setActiveTab("my-jobs");
            fetchMyJobs();
            setJobData({
                companyName: "", position: "", category: "", jobType: "Full-time",
                location: "", description: "", salary: "", experience: "",
                educationLevel: "", aboutCompany: "", companyWebsite: ""
            });
            setLogo(null);
        } catch (err) {
            console.error(err);
            alert("Failed to post job");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full transition-all duration-300 z-10 hidden md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        Employer Hub
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => setActiveTab("dashboard")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab("post-job")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'post-job' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <PlusCircle className="w-5 h-5 mr-3" /> Post New Job
                    </button>
                    <button onClick={() => setActiveTab("my-jobs")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'my-jobs' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> My Jobs
                    </button>
                    {/* <button onClick={() => setActiveTab("applications")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>
                        <Users className="w-5 h-5 mr-3" /> Applications
                    </button> */}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay (Simplified for now) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 transition-all">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab.replace("-", " ")}</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">Welcome Back</span>
                        <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                            E
                        </div>
                    </div>
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
                        {/* Add more stats here */}
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
                                                <td className="px-6 py-4">
                                                    <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:text-red-700 p-2">
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

                {/* Post Job View */}
                {activeTab === "post-job" && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                        <form onSubmit={handlePostJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input type="text" value={jobData.companyName} onChange={e => setJobData({ ...jobData, companyName: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position / Job Title</label>
                                    <input type="text" value={jobData.position} onChange={e => setJobData({ ...jobData, position: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" value={jobData.location} onChange={e => setJobData({ ...jobData, location: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                    <select value={jobData.jobType} onChange={e => setJobData({ ...jobData, jobType: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                        <option>Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input type="text" value={jobData.category} onChange={e => setJobData({ ...jobData, category: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                                    <input type="text" value={jobData.salary} onChange={e => setJobData({ ...jobData, salary: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo (Optional)</label>
                                <input type="file" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} className="w-full" accept="image/*" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                <textarea rows={5} value={jobData.description} onChange={e => setJobData({ ...jobData, description: e.target.value })} className="w-full border rounded-lg px-4 py-2"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
                                Post Job
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
