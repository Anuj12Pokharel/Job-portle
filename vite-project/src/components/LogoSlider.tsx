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

  // Build a track that is guaranteed to cover the screen
  let baseList = [...logos];
  while (baseList.length < 8 && baseList.length > 0) {
    baseList = [...baseList, ...logos];
  }

  // Multiply by 2 for seamless -50% translation
  const track1 = [...baseList, ...baseList];
  
  // Create a reversed track for the second row, also duplicated
  const reversedBase = [...baseList].reverse();
  const track2 = [...reversedBase, ...reversedBase];

  return (
    <div className="w-full py-16 overflow-hidden">
      <h1 className="text-center font-bold text-3xl md:text-4xl text-cyan-600 mb-12">
        Top Employers
      </h1>

      <div className="relative flex flex-col gap-6 w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Row 1 - Moves Left */}
        <div className="flex w-max animate-marquee gap-6 pr-6">
          {track1.map((logo, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 w-64 h-28 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_10px_30px_rgba(8,145,178,0.15)] hover:border-cyan-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <img
                src={`${API_BASE_URL}/${logo.logo.replace(/\\/g, "/")}`}
                alt="employer logo"
                className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Row 2 - Moves Right */}
        <div className="flex w-max animate-marquee-reverse gap-6 pr-6">
          {track2.map((logo, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 w-64 h-28 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_10px_30px_rgba(8,145,178,0.15)] hover:border-cyan-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <img
                src={`${API_BASE_URL}/${logo.logo.replace(/\\/g, "/")}`}
                alt="employer logo"
                className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
