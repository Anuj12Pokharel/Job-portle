import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const navigate = useNavigate();

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

    return (
        <div className="w-full bg-transparent mt-[-1.5rem] mb-4 relative z-10 px-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-white rounded-2xl md:rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-1.5 border border-gray-100 transition-all duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.1)]">
                <div className="flex-[1.5] flex items-center px-4 md:px-6 py-2 md:py-1 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto">
                    <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Job title, keywords..."
                        className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-base py-2"
                    />
                </div>
                <div className="flex-1 flex items-center px-4 md:px-6 py-2 md:py-1 w-full md:w-auto">
                    <MapPin className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
                    <input
                        type="text"
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="City or remote..."
                        className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-base py-2"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-[#FF4F3A] text-white rounded-full px-6 py-2.5 hover:bg-[#E6422E] font-semibold transition-all duration-300 flex items-center justify-center whitespace-nowrap text-sm mt-2 md:mt-0 shadow-[0_8px_20px_rgba(255,79,58,0.25)] hover:shadow-[0_12px_25px_rgba(255,79,58,0.35)] group active:scale-[0.98]"
                >
                    Search Jobs <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
            </div>
        </div>
    );
};

export default GlobalSearch;
