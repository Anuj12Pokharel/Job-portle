import React from "react";

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

interface BenefitserviceProps {
  title?: string;
  subtitle?: string;
  benefits?: BenefitItem[];
}

const defaultBenefits: BenefitItem[] = [
  {
    id: "01",
    title: "Strong Online Presence",
    description: "We receive an average of 10000+ visits to our website, increasing the visibility of your job postings."
  },
  {
    id: "02",
    title: "Large Talent Pool",
    description: "Access a database of over 5,000+ active and qualified jobseekers ready for new opportunities."
  },
  {
    id: "03",
    title: "Proven Hiring Success",
    description: "More than 1000+ candidates have been successfully placed across various companies through our platform."
  },
  {
    id: "04",
    title: "Trusted by Employers",
    description: "We've collaborated with 100+ companies across multiple industries, earning their trust and satisfaction."
  },
  {
    id: "05",
    title: "Industry Expertise",
    description: "With over a decade of hands-on experience, we bring expert knowledge and reliability to every partnership."
  }
];

const Benefitservice: React.FC<BenefitserviceProps> = ({ 
  title = "Why work with us?", 
  subtitle = "Benefits of working with us", 
  benefits = defaultBenefits 
}) => {
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row-reverse items-center md:gap-8 rounded-xl shadow-xl border border-gray-200 p-6 text-justify mt-11">
        <div className="flex-1">
          {benefits.map((benefit, index) => (
            <div key={index} className={index > 0 ? "mt-4" : ""}>
              <h1 className="text-cyan-600 text-xl font-bold">
                {benefit.id}- {benefit.title}
              </h1>
              <p className="mt-2">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="px-9 lg:flex flex-1 flex-col hidden">
          <h1 className="font-bold text-3xl text-cyan-600">{title}</h1>
          <p className="mt-2 text-lg">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Benefitservice;
