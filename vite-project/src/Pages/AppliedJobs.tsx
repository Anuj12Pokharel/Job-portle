import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Calendar, MapPin, Briefcase, Building2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`${API_BASE_URL}/api/jobs/user/applied`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch applied jobs", err);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "applied": return "bg-gray-100 text-gray-700 border-gray-200";
            case "viewing": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "hiring-process": return "bg-purple-50 text-purple-700 border-purple-200";
            case "hired": return "bg-green-50 text-green-700 border-green-200";
            case "rejected": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "hiring-process": return "Hiring Process";
            default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getStepStatus = (currentStatus: string, stepStatus: string) => {
        const order = ["applied", "viewing", "hiring-process", "hired"];
        const currentIndex = order.indexOf(currentStatus);
        const stepIndex = order.indexOf(stepStatus);

        if (currentStatus === "rejected") return "rejected";
        if (currentIndex >= stepIndex) return "completed";
        return "pending";
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
                    <p className="mt-2 text-gray-600">Track the status of your job applications</p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-500 mb-6">Start exploring jobs and apply to positions that match your skills.</p>
                        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                            Explore Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app: any) => (
                            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Job Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{app.job?.position || "Unknown Position"}</h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <Building2 className="w-4 h-4 mr-2" />
                                                    <span className="font-medium">{app.job?.companyName || "Unknown Company"}</span>
                                                    <Link to={`/jobs/${app.job?._id}`} className="ml-2 text-gray-400 hover:text-teal-600">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)} h-fit`}>
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {app.job?.location || "N/A"}
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                                {app.job?.jobType || "N/A"}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Stepper */}
                                <div className="mt-6 border-t pt-6">
                                    <div className="relative flex justify-between w-full max-w-3xl mx-auto">
                                        {/* Steps */}
                                        {["applied", "viewing", "hiring-process", "hired"].map((step, index) => {
                                            const state = getStepStatus(app.status, step);
                                            const labels: Record<string, string> = {
                                                "applied": "Applied",
                                                "viewing": "Viewing",
                                                "hiring-process": "Hiring Process",
                                                "hired": "Hired"
                                            };

                                            let circleClass = "bg-gray-200 text-gray-400 border-gray-200";
                                            let lineClass = "bg-gray-200";

                                            if (state === "completed") {
                                                circleClass = "bg-teal-600 text-white border-teal-600";
                                            } else if (state === "rejected") {
                                                circleClass = "bg-gray-200 text-gray-400 border-gray-200"; // Rejected state handling if needed, or keep gray
                                            }

                                            if (app.status === "rejected" && step === "hired") {
                                                // Special case for rejected? Maybe mark the whole thing red?
                                                // For now, let's keep it simple: rejected just stops progress.
                                            }

                                            return (
                                                <div key={step} className="flex flex-col items-center relative z-10 w-24">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-colors duration-300 ${circleClass}`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className={`mt-2 text-xs font-medium ${state === "completed" ? "text-teal-700" : "text-gray-500"}`}>
                                                        {labels[step]}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Connecting Line Pending */}
                                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0 transform scale-x-[0.9]"></div>

                                        {/* Connecting Line Active */}
                                        {app.status !== 'rejected' && (
                                            <div
                                                className="absolute top-4 left-0 h-0.5 bg-teal-600 -z-0 transition-all duration-500 transform scale-x-[0.9] origin-left"
                                                style={{
                                                    width: app.status === 'hired' ? '100%' :
                                                        app.status === 'hiring-process' ? '66%' :
                                                            app.status === 'viewing' ? '33%' : '0%'
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                    {app.status === "rejected" && (
                                        <div className="text-center mt-4 text-sm text-red-600 font-medium bg-red-50 p-2 rounded">
                                            Application Rejected
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
