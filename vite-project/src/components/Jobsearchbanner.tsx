import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/back.jpeg";

const Jobsearchbanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <div
        className="relative bg-cover bg-center h-[400px] flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className=" bg-transparent max-w-2xl w-full">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-4">
            Linking Talent and Opportunities
          </h1>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden shadow-lg bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by job title, location, or keyword..."
              className="w-full px-4 py-3 focus:outline-none text-gray-700"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 font-medium transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobsearchbanner;
