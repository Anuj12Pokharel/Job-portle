import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import backgroundImage from "../assets/back.jpeg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Jobsearchbanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [banner, setBanner] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/job-search`);
      const data = await response.json();
      if (data.success) {
        setBanner(data.data);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (locationTerm.trim()) params.append("location", locationTerm.trim());

    const queryString = params.toString();
    if (queryString) {
      navigate(`/jobs?${queryString}`);
    } else {
      navigate("/jobs");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const bannerImageUrl = banner?.backgroundImage
    ? `${API_BASE_URL}${banner.backgroundImage}`
    : backgroundImage;

  return (
    <div>
      <div
        className="relative bg-cover bg-center h-[400px] flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className=" bg-transparent max-w-3xl w-full">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-6">
            {banner?.title || "Linking Talent and Opportunities"}
          </h1>
          <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full shadow-lg p-2 max-w-4xl w-full">
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
              <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, keywords..."
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-base md:text-lg"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 w-full md:w-auto">
              <MapPin className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City or remote..."
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-base md:text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#FF4F3A] text-white rounded-full px-8 py-3 hover:bg-[#E6422E] font-bold transition flex items-center justify-center whitespace-nowrap text-base md:text-lg mt-2 md:mt-0"
            >
              Search Jobs <span className="ml-2 font-normal text-xl leading-none">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobsearchbanner;
