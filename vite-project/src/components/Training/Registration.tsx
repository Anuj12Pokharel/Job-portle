import React, { useState, useEffect } from "react";
import { Users, BookOpen, Award, Clock, Rocket, Star, TrendingUp, Shield, CheckCircle } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface TrainingStats {
  studentsTrained: number;
  coursesAvailable: number;
  successRate: number;
  supportAvailable: string;
}

const Registration = () => {
  const [stats, setStats] = useState<TrainingStats>({
    studentsTrained: 0,
    coursesAvailable: 0,
    successRate: 0,
    supportAvailable: "24/7",
  });
  const [loading, setLoading] = useState(true);

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

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}K+`;
    }
    return `${num}+`;
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-cyan-600">
            Ready to Transform Your Career?
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals who have advanced their careers
            through our comprehensive training programs.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-24 items-stretch">

          {/* LEFT — Stats Cards + Why Choose */}
          <div className="flex flex-col gap-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white text-center p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-cyan-600">
                  {loading ? "..." : formatNumber(stats.studentsTrained)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Trained</div>
              </div>

              <div className="bg-white text-center p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <BookOpen className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-cyan-600">
                  {loading ? "..." : `${stats.coursesAvailable}+`}
                </div>
                <div className="text-sm text-gray-500 mt-1">Courses Available</div>
              </div>

              <div className="bg-white text-center p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Award className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-cyan-600">
                  {loading ? "..." : `${stats.successRate}%`}
                </div>
                <div className="text-sm text-gray-500 mt-1">Success Rate</div>
              </div>

              <div className="bg-white text-center p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Clock className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-cyan-600">
                  {loading ? "..." : stats.supportAvailable}
                </div>
                <div className="text-sm text-gray-500 mt-1">Support Available</div>
              </div>
            </div>

            {/* Why Choose */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-cyan-100 p-6 rounded-xl flex-1">
              <h3 className="font-bold text-gray-800 text-base mb-4">Why Choose JobLink360?</h3>
              <ul className="space-y-3">
                {[
                  "Industry-certified instructors",
                  "Hands-on practical training",
                  "Job placement assistance",
                  "Flexible scheduling options",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — Attractive CTA Panel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-700 p-10 text-white flex flex-col justify-between">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-300 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Top content */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
                Top Rated Training Platform
              </span>

              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Launch Your Career <br />
                <span className="text-yellow-300">to the Next Level</span>
              </h3>
              <p className="text-cyan-100 text-sm leading-relaxed max-w-sm">
                Enroll in any of our industry-leading courses and gain the skills
                employers are looking for. Real projects, real mentors, real results.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="relative z-10 space-y-4 my-8">
              {[
                {
                  icon: <Rocket className="h-5 w-5 text-yellow-300" />,
                  title: "Fast-Track Learning",
                  desc: "Complete courses in weeks, not years",
                },
                {
                  icon: <TrendingUp className="h-5 w-5 text-yellow-300" />,
                  title: "Career Growth Guaranteed",
                  desc: "Placement support until you land the job",
                },
                {
                  icon: <Shield className="h-5 w-5 text-yellow-300" />,
                  title: "Certified & Recognized",
                  desc: "Industry-recognized certificates upon completion",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="bg-white bg-opacity-15 p-2.5 rounded-xl flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-cyan-200 text-xs mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA hint */}
            <div className="relative z-10 border-t border-white border-opacity-20 pt-5">
              <p className="text-cyan-100 text-xs text-center leading-relaxed">
                🎯 Click{" "}
                <span className="font-bold text-white">"Enroll Now"</span>{" "}
                on any course in the gallery above to get started instantly.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Registration;
