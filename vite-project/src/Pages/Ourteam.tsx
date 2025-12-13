import React from "react";

const teamMembers = [
  {
    name: " Prem Rijal",
    role: "Founder",
    title: "MBA",
    image: "https://via.placeholder.com/150", // Replace with real image URL
  },
  {
    name: " Bishwojit Singh",
    role: "Co-Founder",
    title: "Engineer",
    image: "https://via.placeholder.com/150", // Replace with real image URL
  },
  {
    name: "Anjali Singh",
    role: "Managing Director",
    title: "MBA",
    image: "",
  },
];

export default function Ourteam() {
  return (
    <section className="bg-gray-50 py-12 px-6 lg:px-20 text-center">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-teal-600 mb-2">Our Team</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Our team brings experience, innovation, and integrity to every project.
      </p>

      {/* Team Members */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow-md mb-4">
                  {member.role}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-teal-600 font-medium">{member.role}</p>
              <p className="text-green-600 italic">{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
