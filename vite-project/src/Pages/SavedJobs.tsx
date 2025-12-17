import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Calendar, MapPin, Briefcase, Building2, ExternalLink, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`${API_BASE_URL}/api/jobs/user/saved`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch saved jobs", err);
            setLoading(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                    <p className="mt-2 text-gray-600">Review jobs you have bookmarked for later.</p>
                </div>

                {jobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookmarkCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                        <p className="text-gray-500 mb-6">Find jobs that interest you and save them here.</p>
                        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                            Explore Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job: any) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{job.position || "Unknown Position"}</h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <Building2 className="w-4 h-4 mr-2" />
                                                    <span className="font-medium">{job.postedBy?.companyName || "Unknown Company"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {job.location || "N/A"}
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                                {job.jobType || "N/A"}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                Posted on {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 md:pt-0 md:border-l md:border-gray-100 md:pl-6">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
