import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LogoSlider = () => {
  const [logos, setLogos] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/client-logos/get`);
        setLogos(res.data);
      } catch (err) {
        console.error("Failed to fetch client logos", err);
      }
    };
    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  // Duplicate logos to ensure infinite scroll effect works smoothly even with few items
  // If we have very few logos, we might need more repetitions.
  // Original had 5 logos repeated 3 times = 15 items.
  // Let's ensure we have at least 15 items if possible, or just repeat the list 4 times.
  const displayLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="px-20">
      <h1 className=" text-center mt-9 font-bold text-3xl text-cyan-600">
        Some of our happy clients
      </h1>
      <div className="flex overflow-hidden py-12 px-14">
        <div className="flex space-x-16 animate-marquee ">
          {displayLogos.map((logo, index) => (
            <img
              key={`${logo._id}-${index}`}
              src={`${API_BASE_URL}/${logo.logo.replace(/\\/g, "/")}`}
              alt="client logo"
              className="h-16 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
