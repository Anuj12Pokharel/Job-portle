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
        <div className="w-full bg-transparent -mt-10 mb-8 relative z-10 px-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full shadow-2xl p-2 border border-gray-100">
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
                    className="w-full md:w-auto bg-[#FF4F3A] text-white rounded-full px-8 py-3 hover:bg-[#E6422E] font-bold transition flex items-center justify-center whitespace-nowrap text-base md:text-lg mt-2 md:mt-0 shadow-lg"
                >
                    Search Jobs <span className="ml-2 font-normal text-xl leading-none">&rarr;</span>
                </button>
            </div>
        </div>
    );
};

export default GlobalSearch;
