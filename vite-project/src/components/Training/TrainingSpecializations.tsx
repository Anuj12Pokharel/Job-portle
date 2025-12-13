import React from "react";
import {
  FaCertificate,
  FaInfinity,
  FaChalkboardTeacher,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

export function TrainingSpecializations() {
  const trainings = [
    {
      title: "Certificate of Completion recognized by leading employers",
      icon: <FaCertificate className="text-white text-6xl" />,
    },
    {
      title: "Lifetime access to learning materials and updates",
      icon: <FaInfinity className="text-white text-6xl" />,
    },
    {
      title: "Free access to career workshops and webinars",
      icon: <FaChalkboardTeacher className="text-white text-6xl" />,
    },
    {
      title: "Access to network with industry professionals",
      icon: <FaUsers className="text-white text-6xl" />,
    },
    {
      title: "1-on-1 mentoring meetings upon request",
      icon: <FaUserTie className="text-white text-6xl" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Customer Service Training Specializations
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
          Master every aspect of customer service with our comprehensive
          training modules
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {trainings.map((training) => (
            <div key={training.title} className="flex flex-col items-center">
              <div className="relative">
                {/* Outer glowing circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-spin-slow blur-sm opacity-70"></div>

                {/* Inner circle */}
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-cyan-600 shadow-lg animate-pulse border-4 border-white">
                  {training.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mt-4">
                {training.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
