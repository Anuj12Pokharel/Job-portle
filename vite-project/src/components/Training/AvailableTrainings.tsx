import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Calendar, User, X, ArrowRight } from "lucide-react";

interface Training {
    id: number;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    price: string;
    startDate: string;
    image: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const shifts = [
    { value: "morning", label: "Morning (6:00 AM - 12:00 PM)" },
    { value: "day", label: "Day (12:00 PM - 6:00 PM)" },
    { value: "evening", label: "Evening (6:00 PM - 10:00 PM)" },
];

const AvailableTrainings = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Enrollment modal state
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        shift: "",
        course: "",
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

    const handleEnroll = (courseTitle: string) => {
        setFormData({ name: "", email: "", phone: "", shift: "", course: courseTitle });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/enrollments`, formData);
            if (response.data.success) {
                alert(response.data.message || "Enrollment submitted successfully! We'll contact you soon.");
                setShowModal(false);
                setFormData({ name: "", email: "", phone: "", shift: "", course: "" });
            }
        } catch (error: any) {
            console.error("Error submitting enrollment:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit enrollment. Please try again.";
            alert(errorMessage);
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
        <section className="p-6 bg-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent">
                    Training Gallery
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Explore our comprehensive training programs designed to accelerate
                    your career growth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trainings.map((training) => (
                        <div
                            key={training.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={training.image}
                                    alt={training.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {training.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {training.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <User className="h-4 w-4 mr-2 text-cyan-500" />
                                        <span className="text-sm">{training.instructor}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-2 text-cyan-500" />
                                        <span className="text-sm">{training.duration}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
                                        <span className="text-sm">Starts: {training.startDate}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center font-bold text-cyan-600 text-lg">
                                        <span className="font-semibold"> Rs {training.price} </span>
                                    </div>
                                    <button
                                        onClick={() => handleEnroll(training.title)}
                                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enrollment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
                                    {shifts.map((shift) => (
                                        <option key={shift.value} value={shift.value}>
                                            {shift.label}
                                        </option>
                                    ))}
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
