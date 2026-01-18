import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const Outsourcing = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Job Posting Platform
          </h2>
          <p className="text-black mt-2 text-justify">
          We allow employers to reach a wide range
of possible candidates, increasing visibility and improving the
effectiveness of the hiring process through our job portal.
          </p>
        </div>

        <ServiceInquiry />
      </div>
      <LogoSlider />
      <Benefitservice />
      <div className="text-center py-14 bg-teal-600 mt-5 w-full text-white rounded-s-sm shadow-xl border border-teal-800  ">
        <h1 className="text-2xl font-bold">
          {" "}
          Have questions ? Our experts are here to help.
        </h1>
        <p className="mt-1 text-xl font-semibold">contact us: 01-4502062</p>
      </div>
      <FQ />
    </div>
  );
};

export default Outsourcing;
