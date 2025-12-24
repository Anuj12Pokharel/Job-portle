import React from "react";
import backgroundImage from "../assets/back.jpeg";
import Ourteam from "./Ourteam";
import Joblink from "../assets/JobLink.jpeg";
import mission from "../assets/Mission.jpeg";
import vision from "../assets/Vision.jpeg";
import whychoose from "../assets/Choose.jpeg";

export default function Aboutus() {
  return (
    <>
      <div
        className="relative bg-cover bg-center h-[250px] md:h-[350px] flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {" "}
        <p className="text-white font-bold text-2xl"> About us </p>
      </div>
      <section className="bg-white px-6 lg:px-20 py-12 space-y-12">
        {/* Intro */}
        <div className="flex flex-col lg:flex-row items-center gap-8  p-6">
          <div className="flex-1 ">
            <h2 className="font-bold text-lg text-teal-600">
              JobLink360 | Linking Talent and Opportunity
            </h2>
            <p className="text-black mt-2 text-justify">
              JobLink360, operating under the brand name Hamro Job PVT.LTD. is
              becoming a Leading company in Nepal for professional and honest HR
              services. Established with a keen understanding of the nation's
              dynamic job market, our company is committed to bringing talented
              individuals and sound employers together. JobLink360 prioritizes
              quality, reliability, and professionalism, making us your partner
              of choice for complete human resource solutions.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={Joblink}
              alt="Intro"
              className="rounded-full object-cover  h-72  shadow-md"
            />
          </div>
        </div>

        {/* Mission */}
        <div className="flex flex-col lg:flex-row-reverse items-center md:gap-8  p-6">
          <div className="flex-1">
            <h2 className="font-bold text-lg text-teal-600">Our Mission</h2>
            <p className="text-black mt-2 text-justify">
              Our mission at JobLink360 is simple yet purposeful: to deliver
              professional and ethical human resource services that connect
              potential employers with talented individuals. Our commitment is
              to make recruitment more transparent, efficient, and human
              capital-driven. We design our services to enable job seekers and
              organizations to build sustainable job opportunities and a robust
              workforce environment throughout Nepal.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={mission}
              alt="Mission"
              className="rounded-lg shadow-md h-72 hidden md:block"
            />
          </div>
        </div>

        {/* Vision */}
        <div className="flex flex-col lg:flex-row items-center md:gap-8 p-6">
          <div className="flex-1">
            <h2 className="font-bold text-lg text-teal-600">Our Vision</h2>
            <p className="text-black mt-2 text-justify">
              We envision ourselves as Nepal's premier HR solution provider on
              the basis of our integrity, innovation, and excellence. Through
              continuous improvement, strategic partnerships, and client
              achievement, we aspire to become Nepal's top HR company and make
              the job market more productive and inclusive.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={vision}
              alt="Vision"
              className="rounded-2xl shadow-lg  h-72  object-contain hidden md:block "
            />
          </div>
        </div>

       
        {/* Why Choose Us */}
        <div className="flex flex-col lg:flex-row items-center p-6">
          <div className="flex-1 ">
            <h2 className="font-bold text-lg text-teal-600">
              Why Choose JobLink360?
            </h2>
            <p className="text-black mt-2 text-justify">
              We don't just fill positions at JobLink360, we build careers and
              strengthen organizations. Our customized approach, industry
              expertise, and expansive network of professionals enable us to
              deliver results that exceed expectations. We think people should
              be matched not just with jobs, but with purpose.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={whychoose}
              alt="Why Choose Us"
              className=" hidden md:block rounded-full object-cover  h-72 "
            />
          </div>
        </div>
      </section>
      <Ourteam />
    </>
  );
}
