import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card.jsx";

function CardBlock({ title, note, items }) {
  const [isHovered, setIsHovered] = useState(false);

  const toggleList = () => {
    // Toggle for mobile (tap support)
    setIsHovered((prev) => !prev);
  };

  return (
    <Card
      className="border-2 border-green-300 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleList}
    >
      <CardHeader>
        <CardTitle className="text-xl text-black">{title}</CardTitle>
        {note && (
          <p className="text-sm text-gray-600">
            {isHovered ? "Release to close list" : note}
          </p>
        )}
      </CardHeader>

      {isHovered && (
        <CardContent className="absolute z-10 bg-white border border-green-500 rounded shadow-lg w-full max-h-64 overflow-auto top-full left-0">
          <ol className="space-y-2 text-black p-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="text-base hover:text-green-600 hover:font-semibold transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ol>
        </CardContent>
      )}
    </Card>
  );
}

export default function Jobcard() {
  const jobCategories = [
    {
      title: "JOBS BY EMPLOYMENT TYPE:",
      note: "(hover to see list)",
      items: ["Full time", "Part time", "Contract", "Freelance", "Internship", "Traineeship"],
    },
    {
      title: "JOBS BY SECTOR TYPE:",
      note: "(hover to see list)",
      items: ["Government", "Banking & Insurance", "NGOs & INGOs", "Industry", "Hospitality", "IT"],
    },
    {
      title: "JOBS BY LOCATION:",
      note: "(hover to see list)",
      items: ["Kathmandu", "Lalitpur", "Pokhara", "Birjung", "Kanchanpur", "more"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {jobCategories.map((cat, idx) => (
        <CardBlock key={idx} {...cat} />
      ))}
    </div>
  );
}
