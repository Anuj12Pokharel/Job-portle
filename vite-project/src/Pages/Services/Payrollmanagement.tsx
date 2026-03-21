import React from "react";
import ServiceInquiry from "../../components/ServiceInquiry";
import LogoSlider from "../../components/LogoSlider";
import Benefitservice, { BenefitItem } from "../../components/Benefitservice";
import FQ from "../../components/FQ";

const payrollBenefits: BenefitItem[] = [
  { id: "01", title: "100% Accuracy", description: "Eliminate costly payroll errors with our precise, automated, and expertly managed systems." },
  { id: "02", title: "Timely Disbursal", description: "Ensure your employees are paid on time, every time, boosting morale and trust." },
  { id: "03", title: "Tax Compliance", description: "We handle all complex tax calculations, deductions, and statutory filings automatically." },
  { id: "04", title: "Data Security", description: "Your sensitive financial and employee data is protected with enterprise-grade security protocols." },
  { id: "05", title: "Detailed Reporting", description: "Gain access to comprehensive financial reports and payroll summaries to help with forecasting." }
];

const Payrollmanagement = () => {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center md:gap-8  p-8">
        <div className="flex-1">
          <h2 className="font-bold  text-teal-600 text-3xl">
            Payroll Management
          </h2>
          <p className="text-black mt-2 text-justify">
           We facilities right from recruitment processes
and induction to payroll management, and exit management, our
HR outsourcing services streamline procedures and reduce
administrative burdens on your organization.
          </p>
        </div>

        <ServiceInquiry />
      </div>
      <LogoSlider />
      <Benefitservice 
        title="Why Choose Our Payroll Service?" 
        subtitle="Benefits of our Payroll Management" 
        benefits={payrollBenefits} 
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

export default Payrollmanagement;
