import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function ApplyJob() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");
    const [totalExperience, setTotalExperience] = useState("");
    const [expectedSalary, setExpectedSalary] = useState("");
    const [fieldOfExpertise, setFieldOfExpertise] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const backendBase =
        import.meta.env.VITE_API_BASE_URL ||
        "https://job-portle-backend-fsai.onrender.com";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!resume) {
            setError("Please upload your resume/CV.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("coverLetter", coverLetter);
        formData.append("totalExperience", totalExperience);
        formData.append("expectedSalary", expectedSalary);
        formData.append("fieldOfExpertise", fieldOfExpertise);
        formData.append("additionalInfo", additionalInfo);
        formData.append("resume", resume);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must be logged in to apply.");
                setLoading(false);
                // Optional: redirect to login if token expired
                return;
            }

            await axios.post(
                `${backendBase}/api/jobs/apply/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate("/user-dashboard"); // Redirect to user dashboard or jobs
            }, 2000);

        } catch (err: any) {
            console.error("Application error:", err);
            setError(err.response?.data?.message || "Failed to apply. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Sent!</h2>
                    <p className="text-gray-600">Your application has been successfully submitted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        Apply for Job
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                        Complete the form below to apply for this position.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Resume / CV <span className="text-red-500">*</span>
                        </label>
                        <label
                            htmlFor="file-upload"
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${resume ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400"}`}
                        >
                            <div className="space-y-1 text-center">

                                {resume ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="mx-auto h-12 w-12 text-green-500 mb-2" />
                                        <p className="text-sm text-green-700 font-medium truncate max-w-xs">{resume.name}</p>
                                        <p className="text-xs text-gray-500">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                                    </>
                                )}

                            </div>
                        </label>
                        {resume && (
                            <button
                                type="button"
                                onClick={() => setResume(null)}
                                className="mt-2 text-xs text-red-500 hover:underline"
                            >
                                Remove file
                            </button>
                        )}
                    </div>

                    {/* New Fields Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Total Experience (Years)
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="e.g. 3"
                                value={totalExperience}
                                onChange={(e) => setTotalExperience(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Expected Salary
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="e.g. $50,000/year"
                                value={expectedSalary}
                                onChange={(e) => setExpectedSalary(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Field of Expertise
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g. Frontend Development, Marketing"
                            value={fieldOfExpertise}
                            onChange={(e) => setFieldOfExpertise(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Additional Details
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none bg-gray-50 focus:bg-white"
                            placeholder="Any other necessary details..."
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cover Letter <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none bg-gray-50 focus:bg-white"
                            placeholder="Why are you a good fit for this role?"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Submitting Application..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
