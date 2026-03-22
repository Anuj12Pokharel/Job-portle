import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice, { BenefitItem } from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const corporateBenefits: BenefitItem[] = [
  { id: "01", title: "Flawless Execution", description: "We manage all logistics and coordination, ensuring your event runs seamlessly from start to finish." },
  { id: "02", title: "Customized Planning", description: "Tailored event strategies that align with your specific company culture and goals." },
  { id: "03", title: "Stress-Free Experience", description: "Our expert team handles the complexities so you can focus on enjoying and hosting the event." },
  { id: "04", title: "Vendor Management", description: "We coordinate with top-tier vendors to provide premium catering, venues, and equipment." },
  { id: "05", title: "Memorable Impact", description: "We create engaging and memorable experiences that leave a lasting positive impression on attendees." }
];

const Corporate = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Seamless Management of corporate Events
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
      <Benefitservice 
        title="Why Choose Our Event Management?" 
        subtitle="Benefits of our Event Services" 
        benefits={corporateBenefits} 
      />
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
