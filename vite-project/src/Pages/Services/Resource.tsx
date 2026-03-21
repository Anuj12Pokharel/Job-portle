import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice, { BenefitItem } from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const hrConsultingBenefits: BenefitItem[] = [
  { id: "01", title: "Strategic Alignment", description: "Align your human resource practices directly with your long-term business goals." },
  { id: "02", title: "Compliance Assurance", description: "Ensure your company policies are fully compliant with the latest local labor laws and regulations." },
  { id: "03", title: "Performance Management", description: "Implement robust frameworks to track, evaluate, and boost employee performance." },
  { id: "04", title: "Conflict Resolution", description: "Professional mediation and management of internal workplace conflicts and grievances." },
  { id: "05", title: "Policy Development", description: "Tailored creation of employee handbooks, contracts, and company-wide policies." }
];

const Resource = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Strategic HR Consulting for Better Business Practices{" "}
          </h2>
          <p className="text-black mt-2 text-justify">
           We assist to design people and culture policies of
the organizations, conduct HR audits, and develop efficient
organizational structures that optimize business development
and regulatory adherence. 
          </p>
        </div>

        <ServiceInquiry />
      </div>
      <LogoSlider />
      <Benefitservice 
        title="Why Choose Our HR Consulting?" 
        subtitle="Benefits of our Consulting Services" 
        benefits={hrConsultingBenefits} 
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

export default Resource;
