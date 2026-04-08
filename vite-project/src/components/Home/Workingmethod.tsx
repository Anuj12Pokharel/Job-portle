// src/components/Workingmethod
import React, { useRef } from "react";

import Advancejob from "../../assets/Advancejob.png";
import careeropor from "../../assets/Careeropor.png";
import Realtime from "../../assets/Realtime.png";
import Premium from "../../assets/Premium.png";
const steps = [
  {
    title: "Advanced Job Search Functionality",
    description:
      "Search for job vacancies easily with advanced filters by sector, location, job category, and experience level allowing you to search for jobs that best match your professional resume.",
    image: Advancejob,
  },
  {
    title: "Extensive Career Opportunities",
    description:
      " From junior-level job vacancies to top executive jobs, JOBLINK360 provides a complete set of job listings, meeting the needs of professionals at every level of their career path.",
    image: careeropor,
  },
  {
    title: "Real-Time Job Alerts",
    description:
      "Get notified immediately via email and SMS the moment new job vacancies that meet your search criteria are posted, so you do not miss any possible opportunity.",
    image: Realtime,
  },
  {
    title: "Exclusive Access to Premium Listings",
    description:
      " Get access to top-level job vacancies available exclusively on JOBLINK360, trusted by leading employers across Nepal for quality talent acquisition.",
    image: Premium,
  },
];
const Workingmethod = () => {
  return (
    <section className="w-full bg-gradient-to-br from-white via-sky-50 to-white text-black p-6 overflow-x-hidden">
      <div className="px-6 max-w-[1400px] mx-auto">
        <h2 className="text-2xl text-cyan-600 font-bold text-center mb-12">
          Your Path to Employment in Nepal Starts with JOBLINK360
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-20 h-20 mx-auto mb-3 object-contain rounded-2xl transition-transform hover:scale-110 duration-300"
              />
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workingmethod;
