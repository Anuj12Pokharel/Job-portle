import React from "react";
import { CheckCircle, ArrowRight, Users, Building } from "lucide-react";
import jobseekerImg from "../../assets/professional_employer.png";

const features = [
  "Joblink360 uses smart technology to quickly suggest the best candidates for job openings.  ",
  "Employers can access a verified database of jobseekers with pre-screened and background-checked profiles. ",
  "The platform includes an interview scheduling tool that helps employers manage interviews efficiently.  ",
  "A custom employer dashboard provides real-time data on hiring stats, applicant flow, and recruitment performance. ",
  "Job openings are promoted across Joblink360 social media channels to increase visibility and reach.",
  "Employers gain access to a pool of verified jobseekers with reliable and background-checked profiles.",
];

const Employer = () => {

  return (
    <section className="py-10 px-10 ">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-xl font-bold mb-6 text-teal-600">
              For Employer:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-lg leading-relaxed text-gray-600 text-justify max-w-xl">{feature}</span>
                </div>
              ))}
            </div>
          </div>
         <div className="lg:w-1/2 flex justify-center items-center">
  <img
    src={jobseekerImg}
    alt="Job Seeker Illustration"
    className="w-full max-w-md mx-auto object-contain rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-[1.02]"
  />
</div>

            
        </div>
      </div>
    </section>
  );
};

export default Employer;
