import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice, { BenefitItem } from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const recruitmentBenefits: BenefitItem[] = [
  { id: "01", title: "Targeted Screening", description: "In-depth candidate screening ensuring only the highest quality fits are presented." },
  { id: "02", title: "Time Efficiency", description: "We handle the sourcing and initial interviews, saving you countless hours." },
  { id: "03", title: "Expert Vetting", description: "Our team utilizes proven methodologies to assess skills, culture fit, and experience." },
  { id: "04", title: "Reduced Turnover", description: "By finding the right match from the start, we help improve your long-term retention rates." },
  { id: "05", title: "End-to-End Support", description: "From initial job posting to final interview scheduling, we manage the entire recruitment lifecycle." }
];

const Recruitment = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Effective Recruitment That Delivers Results
          </h2>
          <p className="text-black mt-2 text-justify">
           Our comprehensive
recruitment services are crafted exclusively for local hiring all
over Nepal. Recruitment process (screening, shortlisting,
selecting, initial interview, interview scheduling, and follow up to
the candidates).
          </p>
        </div>

        <ServiceInquiry />
      </div>
      <LogoSlider />
      <Benefitservice 
        title="Why Choose Our Recruitment?" 
        subtitle="Benefits of our Recruitment Services" 
        benefits={recruitmentBenefits} 
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

export default Recruitment;
