import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Clock, Calendar, User, X, ArrowRight } from "lucide-react";

interface Training {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    price: string;
    startDate: string;
    image: string;
    shifts?: string[];
    shiftTiming?: string;
    students?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const shifts = [
    { value: "morning", label: "Morning (6:00 AM - 12:00 PM)" },
    { value: "day", label: "Day (12:00 PM - 6:00 PM)" },
    { value: "evening", label: "Evening (6:00 PM - 10:00 PM)" },
];

const TrainingCard: React.FC<{ 
    training: Training, 
    handleEnroll: (t: Training) => void,
    handleViewDetails: (t: Training) => void 
}> = ({ training, handleEnroll, handleViewDetails }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group">
            <div className="h-48 overflow-hidden shrink-0 relative">
                <img
                    src={training.image}
                    alt={training.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Rs {training.price}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    {training.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500 text-sm">
                        <User className="h-4 w-4 mr-2 text-cyan-500" />
                        <span>{training.instructor}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-cyan-500" />
                        <span>{training.duration}</span>
                    </div>
                </div>

                {/* Buttons at the bottom - Stacked vertically */}
                <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={() => handleViewDetails(training)}
                        className="w-full py-2.5 rounded-lg text-sm font-bold border border-cyan-100 text-cyan-600 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2"
                    >
                        View Details
                    </button>
                    <button
                        type="button"
                        onClick={() => handleEnroll(training)}
                        className="w-full py-2.5 rounded-lg text-sm font-bold bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-md transition-all flex items-center justify-center"
                    >
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const AvailableTrainings = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    // Enrollment modal state
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTrainingDetails, setSelectedTrainingDetails] = useState<Training | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        shift: "",
        course: "",
        availableShifts: [] as string[],
    });

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/training`);
                setTrainings(response.data.data);
            } catch (err) {
                console.error("Error fetching trainings:", err);
                setError("Failed to load trainings");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    // Auto-open modal if ?enroll= query param is present (e.g. from Home page)
    useEffect(() => {
        const enrollCourse = searchParams.get("enroll");
        if (enrollCourse) {
            const courseTitle = decodeURIComponent(enrollCourse);
            const training = trainings.find(t => t.title === courseTitle);
            setFormData({
                name: "",
                email: "",
                phone: "",
                shift: "",
                course: courseTitle,
                availableShifts: training?.shifts || []
            });
            setShowModal(true);
            // Remove the query param from URL without re-navigating
            setSearchParams({});
        }
    }, [searchParams]);

    const handleEnroll = (training: Training) => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            shift: "",
            course: training.title,
            availableShifts: training.shifts || []
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setShowDetailsModal(false);
        setSelectedTrainingDetails(null);
    };

    const handleViewDetails = (training: Training) => {
        setSelectedTrainingDetails(training);
        setShowDetailsModal(true);
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === "phone") {
            const numericOnly = value.replace(/\D/g, "").slice(0, 15);
            setFormData((prev) => ({ ...prev, [field]: numericOnly }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/enrollments`, formData);
            if (response.data.success) {
                toast.success(response.data.message || "Enrollment submitted successfully! We'll contact you soon.");
                setShowModal(false);
                setFormData({ name: "", email: "", phone: "", shift: "", course: "", availableShifts: [] });
            }
        } catch (error: any) {
            console.error("Error submitting enrollment:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit enrollment. Please try again.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <section id="available-trainings" className="p-6 bg-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-600">
                    Training Gallery
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Explore our comprehensive training programs designed to accelerate
                    your career growth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                    {trainings.map((training) => (
                        <TrainingCard 
                            key={training._id} 
                            training={training} 
                            handleEnroll={handleEnroll} 
                            handleViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedTrainingDetails && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 px-4 pt-24 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all shadow-lg hover:rotate-90"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="h-64 shrink-0 relative">
                            <img
                                src={selectedTrainingDetails.image}
                                alt={selectedTrainingDetails.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                <h3 className="text-3xl font-bold text-white">
                                    {selectedTrainingDetails.title}
                                </h3>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-cyan-50 p-4 rounded-xl flex flex-col items-center text-center">
                                    <User className="h-5 w-5 text-cyan-600 mb-2" />
                                    <span className="text-xs text-gray-500 uppercase font-bold">Instructor</span>
                                    <span className="text-sm font-semibold text-gray-800">{selectedTrainingDetails.instructor}</span>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-xl flex flex-col items-center text-center">
                                    <Clock className="h-5 w-5 text-cyan-600 mb-2" />
                                    <span className="text-xs text-gray-500 uppercase font-bold">Duration</span>
                                    <span className="text-sm font-semibold text-gray-800">{selectedTrainingDetails.duration}</span>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-xl flex flex-col items-center text-center">
                                    <Calendar className="h-5 w-5 text-cyan-600 mb-2" />
                                    <span className="text-xs text-gray-500 uppercase font-bold">Starts</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {selectedTrainingDetails.startDate && new Date(selectedTrainingDetails.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-xl flex flex-col items-center text-center">
                                    <span className="text-cyan-600 font-bold text-lg mb-2">Rs</span>
                                    <span className="text-xs text-gray-500 uppercase font-bold">Price</span>
                                    <span className="text-sm font-semibold text-gray-800">{selectedTrainingDetails.price}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <ArrowRight className="h-5 w-5 text-cyan-600" />
                                        Course Description
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {selectedTrainingDetails.description}
                                    </p>
                                </div>

                                {selectedTrainingDetails.shifts && selectedTrainingDetails.shifts.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-3">Available Shifts</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTrainingDetails.shifts.map((shift, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">
                                                    {shift}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        const t = selectedTrainingDetails;
                                        handleClose();
                                        handleEnroll(t);
                                    }}
                                    className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200/50 flex items-center justify-center gap-2"
                                >
                                    Enroll in this Course Now
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 px-4 pt-24 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all shadow-lg hover:rotate-90"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h3 className="text-2xl font-semibold mb-1 text-cyan-600 text-center">
                            Register Now
                        </h3>
                        <p className="text-gray-500 mb-6 text-center text-sm">
                            Fill out the form below to start your learning journey with us.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Shift */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Shift
                                </label>
                                <select
                                    value={formData.shift}
                                    onChange={(e) => handleInputChange("shift", e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select your preferred shift</option>
                                    {formData.availableShifts && formData.availableShifts.length > 0 ? (
                                        formData.availableShifts.map((shift, idx) => (
                                            <option key={idx} value={shift}>
                                                {shift}
                                            </option>
                                        ))
                                    ) : (
                                        shifts.map((shift) => (
                                            <option key={shift.value} value={shift.value}>
                                                {shift.label}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Course (pre-filled, read-only display) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course of Interest
                                </label>
                                <input
                                    type="text"
                                    value={formData.course}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full flex items-center justify-center text-lg px-4 py-2 rounded-lg font-semibold shadow-md transition group ${submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-teal-600 text-white hover:bg-teal-700"
                                    }`}
                            >
                                {submitting ? "Submitting..." : "Submit Registration"}
                                {!submitting && (
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </section>
    );
};

export default AvailableTrainings;
