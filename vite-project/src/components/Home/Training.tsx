import { useState } from "react";
import axios from "axios";
import { ArrowRight, X, Clock, Users, Award, BookOpen } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const trainings = [
  {
    id: 1,
    title: "Customer Service Assistant",
    description:
      "JobLink360 Customer Service Assistant Training aims to prepare you with the necessary skills and confidence required to succeed in customer-facing positions from diverse industries.",
    details:
      "This comprehensive training covers communication skills, conflict resolution, customer relationship management, and professional etiquette. You will learn how to handle difficult customers, manage complaints effectively, and deliver exceptional service across phone, email, and in-person channels.",
    duration: "4 Weeks",
    candidates: "200+",
    level: "Beginner",
    topics: [
      "Professional Communication Skills",
      "Conflict Resolution & De-escalation",
      "Customer Relationship Management (CRM)",
      "Multi-channel Support (Phone, Email, Chat)",
      "Service Quality & Standards",
    ],
  },
  {
    id: 2,
    title: "HR",
    description:
      "JobLink360's HR Training Course is aimed at aspiring HR professionals and professionals looking to acquire advanced human resource management know-how.",
    details:
      "Gain in-depth knowledge of HR functions including recruitment, onboarding, performance management, payroll, and labor law compliance. This course equips you with practical tools and frameworks used by HR professionals in modern organizations.",
    duration: "6 Weeks",
    candidates: "150+",
    level: "Intermediate",
    topics: [
      "Recruitment & Talent Acquisition",
      "Employee Onboarding & Retention",
      "Performance Management Systems",
      "Payroll & Compensation",
      "Labor Law & Compliance",
    ],
  },
  {
    id: 3,
    title: "Excel & Word (Basic)",
    description:
      "The Excel & Word (Basic) Training by JobLink360 is ideal for beginners looking to build foundational skills in two of the most essential Microsoft Office applications.",
    details:
      "Learn to create, format, and manage documents in Microsoft Word and build spreadsheets, formulas, and charts in Microsoft Excel. This beginner-friendly course is perfect for anyone entering the professional world or looking to boost their productivity.",
    duration: "3 Weeks",
    candidates: "300+",
    level: "Beginner",
    topics: [
      "Microsoft Word: Formatting & Document Design",
      "Microsoft Excel: Spreadsheets & Data Entry",
      "Formulas & Basic Functions",
      "Charts & Data Visualization",
      "File Management & Printing",
    ],
  },
  {
    id: 4,
    title: "MIS",
    description:
      "JobLink360's MIS Training Program is specifically designed to mold your capabilities in managing, analyzing, and reporting organizational data using applications like Microsoft Excel, databases, and reporting systems.",
    details:
      "This course dives deep into Management Information Systems, teaching you how to collect, process, and present data for business decision-making. You will work with Excel advanced functions, database concepts, and reporting dashboards used in real organizations.",
    duration: "5 Weeks",
    candidates: "120+",
    level: "Intermediate",
    topics: [
      "Advanced Excel & Pivot Tables",
      "Database Management Basics",
      "Data Analysis & Reporting",
      "Dashboard Creation",
      "Business Intelligence Fundamentals",
    ],
  },
];


interface Training {
  id: number;
  title: string;
  description: string;
  details: string;
  duration: string;
  candidates: string;
  level: string;
  topics: string[];
}

export default function TrainingsHome() {
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "",
    course: "",
  });

  const handleEnrollClick = (courseTitle: string) => {
    setSelectedTraining(null);
    setEnrollCourse(courseTitle);
    setFormData({ name: "", email: "", phone: "", shift: "", course: courseTitle });
    setShowEnrollModal(true);
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
        alert(response.data.message || "Enrollment submitted successfully! We'll contact you soon.");
        setShowEnrollModal(false);
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

  return (
    <div className="max-w-8xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Explore <span className="text-cyan-600">JobLink360</span> Trainings
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {trainings.map((training) => (
          <div
            key={training.id}
            className="bg-white p-6 rounded-2xl border-b-8 border-teal-600 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {training.id}. {training.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {training.description}
            </p>
            <button
              onClick={() => setSelectedTraining(training)}
              className="inline-flex items-center gap-2 text-cyan-600 font-medium border border-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors group"
            >
              View details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-t-2xl p-6 text-white relative">
              <button
                onClick={() => setSelectedTraining(null)}
                className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <span className="text-xs font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full mb-3 inline-block">
                Training #{selectedTraining.id}
              </span>
              <h2 className="text-2xl font-bold leading-tight">
                {selectedTraining.title}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-cyan-50 rounded-xl p-3 text-center">
                  <Clock className="h-5 w-5 text-cyan-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-bold text-cyan-700">{selectedTraining.duration}</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-3 text-center">
                  <Users className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Candidates</p>
                  <p className="text-sm font-bold text-teal-700">{selectedTraining.candidates}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Award className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-sm font-bold text-blue-700">{selectedTraining.level}</p>
                </div>
              </div>

              {/* About */}
              <div className="mb-5">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-600" />
                  About this Training
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedTraining.details}
                </p>
              </div>

              {/* Topics */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  {selectedTraining.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleEnrollClick(selectedTraining.title)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Enroll in this Course
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment / Registration Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setShowEnrollModal(false)}
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="">Select Shift Timing</option>
                  <option value="Morning (6:00 AM - 10:00 AM)">Morning (6:00 AM - 10:00 AM)</option>
                  <option value="Day (10:00 AM - 2:00 PM)">Day (10:00 AM - 2:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
                  <option value="Evening (6:00 PM - 9:00 PM)">Evening (6:00 PM - 9:00 PM)</option>
                  <option value="Weekend (Saturday/Sunday)">Weekend (Saturday/Sunday)</option>
                </select>
              </div>

              {/* Course (pre-filled, read-only) */}
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
    </div>
  );
}
