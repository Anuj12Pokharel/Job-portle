import React, { useState, useEffect } from "react";
import { X, FileText, Mail, Phone, MapPin, ExternalLink, Calendar, CheckCircle, Clock, Eye, XCircle, Briefcase } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: any;
    onStatusUpdate: (id: string, newStatus: string) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, application, onStatusUpdate }) => {
    const [status, setStatus] = useState(application?.status || "applied");
    const [loading, setLoading] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && application) {
            setStatus(application.status);

            // Construct resume URL
            if (application.resume) {
                const url = application.resume.startsWith("http")
                    ? application.resume
                    : `${API_BASE_URL}/${application.resume.replace(/\\/g, "/")}`;
                setResumeUrl(url);
            }

            // Auto-update status to "viewing" if currently "applied"
            if (application.status === "applied") {
                updateStatus("viewing");
            }
        }
    }, [isOpen, application]);

    const updateStatus = async (newStatus: string) => {
        if (!application) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/api/jobs/application/${application._id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus(newStatus);
            onStatusUpdate(application._id, newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !application) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Application Details
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold uppercase
                                ${status === 'hired' ? 'bg-green-100 text-green-800' :
                                    status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        status === 'hiring-process' ? 'bg-purple-100 text-purple-800' :
                                            status === 'viewing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                {status.replace("-", " ")}
                            </span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="sm:flex sm:h-[80vh]">
                        {/* Sidebar: Applicant Info & Actions */}
                        <div className="sm:w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl font-bold">
                                    {application.user?.fullName?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{application.user?.fullName}</h2>
                                    <p className="text-gray-500 text-sm flex items-center mt-1">
                                        <Mail className="w-3 h-3 mr-1" /> {application.user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Additional Details */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
                                        <Briefcase className="w-4 h-4 mr-2" /> Application Details
                                    </h4>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-2">
                                        <div><span className="font-semibold">Experience:</span> {application.totalExperience ? `${application.totalExperience} years` : "N/A"}</div>
                                        <div><span className="font-semibold">Expected Salary:</span> {application.expectedSalary || "N/A"}</div>
                                        <div><span className="font-semibold">Expertise:</span> {application.fieldOfExpertise || "N/A"}</div>
                                        {application.additionalInfo && (
                                            <div className="pt-2 border-t border-gray-200 mt-2">
                                                <span className="font-semibold block mb-1">Additional Info:</span>
                                                <p className="whitespace-pre-wrap text-gray-600">{application.additionalInfo}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
                                        <FileText className="w-4 h-4 mr-2" /> Cover Letter
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                        {application.coverLetter || "No cover letter provided."}
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                                        Update Status
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => updateStatus("hiring-process")}
                                            disabled={loading || status === "hiring-process"}
                                            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors
                                                ${status === 'hiring-process' ? 'bg-purple-50 text-purple-700 border-purple-200 cursor-default' : 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'}`}
                                        >
                                            <Clock className="w-4 h-4 mr-2" /> Mark as Hiring Process
                                        </button>
                                        <button
                                            onClick={() => updateStatus("hired")}
                                            disabled={loading || status === "hired"}
                                            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors
                                                ${status === 'hired' ? 'bg-green-50 text-green-700 border-green-200 cursor-default' : 'hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark as Hired
                                        </button>
                                        <button
                                            onClick={() => updateStatus("rejected")}
                                            disabled={loading || status === "rejected"}
                                            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors
                                                ${status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 cursor-default' : 'hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Mark as Rejected
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content: Resume Viewer */}
                        <div className="sm:w-2/3 bg-gray-100 p-0 flex flex-col h-full relative">
                            {resumeUrl ? (
                                <iframe
                                    src={resumeUrl}
                                    className="w-full h-full border-none"
                                    title="Resume"
                                >
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <p>PDF view not supported or error loading.</p>
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-teal-600 hover:underline flex items-center">
                                            Download Resume <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                </iframe>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <FileText className="w-16 h-16 mb-4 text-gray-300" />
                                    <p>No resume uploaded for this application.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;
