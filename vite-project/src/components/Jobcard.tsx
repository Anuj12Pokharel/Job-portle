import React, { useState } from "react";

function CardBlock({ title, note, items }) {
  const [isHovered, setIsHovered] = useState(false);

  const toggleList = () => {
    // Toggle for mobile (tap support)
    setIsHovered((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      <div
        className="border-2 border-gray-200 relative cursor-pointer rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleList}
      >
        {/* Header */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-cyan-500">{title}</h2>
          {note && (
            <p className="text-sm text-gray-600">
              {isHovered ? "Release to close list" : note}
            </p>
          )}
        </div>

        {/* Content */}
        <div
          className={`${
            isHovered
              ? "bg-white border border-cyan-500 rounded shadow-lg w-full max-h-64 overflow-auto transition-all duration-300 ease-in-out"
              : "hidden"
          }`}
        >
          <ol className="flex flex-row flex-wrap gap-4 text-black p-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="text-base hover:text-cyan-600 hover:font-semibold transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function Jobcard() {
  const jobCategories = [
    {
      title: "JOBS BY EMPLOYMENT TYPE:",
      note: "(hover to see list)",
      items: [
        "Full time",
        "Part time",
        "Contract",
        "Freelance",
        "Internship",
        "Traineeship",
      ],
    },
    {
      title: "JOBS BY SECTOR TYPE:",
      note: "(hover to see list)",
      items: [
        "Government",
        "Banking & Insurance",
        "NGOs & INGOs",
        "Industry",
        "Hospitality",
        "IT",
      ],
    },
    {
      title: "JOBS BY LOCATION:",
      note: "(hover to see list)",
      items: [
        "Kathmandu",
        "Lalitpur",
        "Pokhara",
        "Birjung",
        "Kanchanpur",
        "more",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {jobCategories.map((cat, idx) => (
        <CardBlock key={idx} {...cat} />
      ))}
    </div>
  );
}
