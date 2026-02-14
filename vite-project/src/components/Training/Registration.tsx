import React, { useState, useEffect } from "react";
import { ArrowRight, Users, BookOpen, Award, Clock } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const courses = [
  "Digital Marketing",
  "Web Development",
  "Data Analysis",
  "Graphic Design",
  "Project Management",
  "Business Analytics",
  "Mobile App Development",
  "UI/UX Design",
  "Content Writing",
  "Social Media Management",
];

const shifts = [
  { value: "morning", label: "Morning (6:00 AM - 12:00 PM)" },
  { value: "day", label: "Day (12:00 PM - 6:00 PM)" },
  { value: "evening", label: "Evening (6:00 PM - 10:00 PM)" },
];

interface TrainingStats {
  studentsTrained: number;
  coursesAvailable: number;
  successRate: number;
  supportAvailable: string;
}

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "",
    course: "",
  });

  const [stats, setStats] = useState<TrainingStats>({
    studentsTrained: 0,
    coursesAvailable: 0,
    successRate: 0,
    supportAvailable: "24/7"
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainingStatistics();
  }, []);

  const fetchTrainingStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/statistics/training`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching training statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/enrollments`, formData);

      if (response.data.success) {
        alert(response.data.message || "Enrollment submitted successfully! We'll contact you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          shift: "",
          course: "",
        });
        // Refresh statistics to show the new enrollment
        fetchTrainingStatistics();
      }
    } catch (error: any) {
      console.error("Error submitting enrollment:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit enrollment. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}K+`;
    }
    return `${num}+`;
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-600">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers
              through our comprehensive training programs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white text-center p-6 rounded-lg shadow">
                  <Users className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-cyan-600">
                    {loading ? "..." : formatNumber(stats.studentsTrained)}
                  </div>
                  <div className="text-sm text-black">Students Trained</div>
                </div>

                <div className="bg-white text-center p-6 rounded-lg shadow">
                  <BookOpen className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-cyan-600">
                    {loading ? "..." : `${stats.coursesAvailable}+`}
                  </div>
                  <div className="text-sm text-black">Courses Available</div>
                </div>

                <div className="bg-white text-center p-6 rounded-lg shadow">
                  <Award className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-cyan-600">
                    {loading ? "..." : `${stats.successRate}%`}
                  </div>
                  <div className="text-sm text-black">Success Rate</div>
                </div>

                <div className="bg-white text-center p-6 rounded-lg shadow">
                  <Clock className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-cyan-600">
                    {loading ? "..." : stats.supportAvailable}
                  </div>
                  <div className="text-sm text-black">Support Available</div>
                </div>
              </div>

              {/* Why Choose */}
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Why Choose JobLink360?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Industry-certified instructors</li>
                  <li> Hands-on practical training</li>
                  <li>Job placement assistance</li>
                  <li> Flexible scheduling options</li>
                </ul>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 ">
              <h3 className="text-2xl font-semibold mb-2 text-cyan-600 text-center">
                Register Now
              </h3>
              <p className="text-gray-500 mb-6 text-center">
                Fill out the form below to start your learning journey with us.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Shift */}
                <div className="space-y-2">
                  <label
                    htmlFor="shift"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Shift
                  </label>
                  <select
                    id="shift"
                    value={formData.shift}
                    onChange={(e) => handleInputChange("shift", e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your preferred shift</option>
                    {shifts.map((shift) => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course of Interest
                  </label>
                  <select
                    id="course"
                    value={formData.course}
                    onChange={(e) =>
                      handleInputChange("course", e.target.value)
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-1/2 flex items-center justify-center text-lg px-2 py-2 rounded-lg font-semibold shadow-md transition group ${submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                  {!submitting && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
