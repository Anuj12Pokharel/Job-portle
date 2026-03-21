import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice, { BenefitItem } from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const trainingBenefits: BenefitItem[] = [
  { id: "01", title: "Skill Enhancement", description: "Equip your workforce with the latest industry skills and competencies." },
  { id: "02", title: "Custom Curriculum", description: "We design training programs tailored specifically to address your organization's unique skill gaps." },
  { id: "03", title: "Expert Instructors", description: "Learn from seasoned industry professionals with extensive practical experience." },
  { id: "04", title: "Increased Productivity", description: "Well-trained employees work more efficiently, directly boosting your bottom line." },
  { id: "05", title: "Employee Retention", description: "Investing in development shows commitment, significantly increasing overall employee loyalty." }
];

const Training = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
           Training and Development
          </h2>
          <p className="text-black mt-2 text-justify">
            Our soft skills training is designed to
strengthen communication, leadership, teamwork, and other vital
interpersonal abilities, thereby strengthening company growth as
well as individual’s professional growth and career success. 
          </p>
        </div>

        <ServiceInquiry />
      </div>
      <LogoSlider />
      <Benefitservice 
        title="Why Choose Our Training?" 
        subtitle="Benefits of our Training Services" 
        benefits={trainingBenefits} 
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

export default Training;
