import React from "react";

const Benefitservice = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row-reverse items-center md:gap-8  rounded-xl shadow-xl border border-gray-200 p-6 text-justify mt-11">
        <div className="flex-1">
          <div>
            <h1 className="text-cyan-600 text-xl font-bold ">
              01- Strong Online Presence{" "}
            </h1>{" "}
            <p className="mt-2">
              We receive an average of 10000+ visits to our website, increasing
              the visibility of your job postings.
            </p>
          </div>
          <div>
            <h1 className="text-cyan-600 text-xl font-bold mt-4 ">
              02- Large Talent Pool{" "}
            </h1>{" "}
            <p className="mt-2">
              Access a database of over 5,000+ active and qualified jobseekers
              ready for new opportunities.
            </p>
          </div>
          <div>
            <h1 className="text-cyan-600 text-xl font-bold mt-4">
              03G�� Proven Hiring Success{" "}
            </h1>
            <p className="mt-2">
              More than 1000+ candidates have been successfully placed across
              various companies through our platform. adherence.
            </p>
          </div>
          <div>
            <h1 className="text-cyan-600 text-xl font-bold mt-4">
              04G�� Trusted by Employers
            </h1>{" "}
            <p className="mt-2">
              WeG��ve collaborated with 100+ companies across multiple
              industries, earning their trust and satisfaction.
            </p>
          </div>
          <div>
            <h1 className="text-cyan-600 text-xl font-bold mt-4 ">
              05G�� Industry Expertise{" "}
            </h1>
            <p className="mt-2">
              With over a decade of hands-on experience, we bring expert
              knowledge and reliability to every partnership.
            </p>
          </div>
        </div>
        <div className=" px-9 lg:flex flex-1 flex-col hidden  ">
          <h1 className="font-bold text-3xl text-cyan-600">
            {" "}
            Why work with us?{" "}
          </h1>

          <p className="mt-2 text-lg"> Benefits of working with us </p>
        </div>
      </div>
    </div>
  );
};

export default Benefitservice;
