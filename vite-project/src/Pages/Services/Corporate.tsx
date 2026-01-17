import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const Corporate = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Seamless Management of Cooperative Events
          </h2>
          <p className="text-black mt-2 text-justify">
            Plan and execute training sessions, job fairs, or cooperative
            gatherings with expert assistance. We take care of logistics and
            coordination to ensure your event runs smoothly.
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

export default Corporate;
