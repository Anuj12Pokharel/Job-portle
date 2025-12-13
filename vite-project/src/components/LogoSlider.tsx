import React from "react";
import association from "../assets/association.png";
import joblink from "../assets/logo.jpeg";
import leaf from "../assets/leaf.png";
import tennis from "../assets/tennis.png";
import coff from "../assets/coff.png";

const LogoSlider = () => {
  const logos = [association, joblink, leaf, tennis, coff];
  return (
    <div className="px-20">
      <h1 className=" text-center mt-9 font-bold text-3xl text-cyan-600">
        Some of our happy clients
      </h1>
      <div className="flex overflow-hidden py-12 px-14">
        <div className="flex space-x-16 animate-marquee ">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt="client logo"
              className="h-16 w-auto object-contain  "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
