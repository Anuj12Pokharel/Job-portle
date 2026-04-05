import React, { useState, useEffect } from "react";
import backgroundImage from "../assets/jobsearch_banner.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Jobsearchbanner = () => {
  const [banner, setBanner] = useState<any>(null);

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

  const bannerImageUrl = banner?.backgroundImage
    ? `${API_BASE_URL}${banner.backgroundImage}`
    : backgroundImage;

  return (
    <div>
      <div
        className="relative bg-cover bg-center h-[400px] flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
      </div>
    </div>
  );
};

export default Jobsearchbanner;
