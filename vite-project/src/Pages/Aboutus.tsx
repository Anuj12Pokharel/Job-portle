import React from "react";
import backgroundImage from "../assets/back.jpeg";
import Ourteam from "./Ourteam";
import Joblink from "../assets/About.jpg";
import mission from "../assets/Mission.jpg";
import vision from "../assets/Vision.jpg";
import whychoose from "../assets/Choose.jpg";
import { LeadershipProfile } from "../components/LeadershipProfile";
import managerImg from "../assets/Tirtha.jpeg"
import photo from "../assets/depraaj.jpeg"

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
       <LeadershipProfile
        role="Chairman"
        name="Diparaj kulung Rai"
        image={photo}
        message="From my professional experience, I have realized that people
are the foundation of any organizational progress. we are
trying to connect the gap between talent and opportunities in
Nepal. Our mission has always been to establish a reliable,
ethical, and professional platform where job seekers can find
the opportunities and employers can get the right individuals
to develop their organizations. As we move forward and
diversify our services, we remain rooted in our vision of
connecting Nepali workforce. With your continued trust and
support, we are confident in our path to becoming a leading
force in HR and recruitment solutions in Nepal."
        personalTouch="We grow together as one team."
        alignment="left"
      />
       <LeadershipProfile
        role="Managing Director"
        name="Tirth Purbachhane"
        image={managerImg}
        message="I am truly delighted to welcome you all to JobLink360, and
words cannot fully express how thrilled I am to have you here. In
a setting where human capital is the real growth driver, we felt
there was a gap between job seekers and job providers in
Nepalese job market. We've constructed a quality-driven,
people-oriented team over the years. Whether you're a job
seeker looking for the right opportunity or an employer looking
for the right talent, we're dedicated to serving and supporting
you every step of the way. We believe that the right job can
transform a life and the right employee can take an organization
to the next level. We are proud to be connecting Nepal’s work
force in right place at a right time. With your trust and
cooperation, we look forward to broadening our scope,
enriching our services, and becoming Nepal's preferred brand
name in HR solutions. We appreciate you joining us on our path.
"
        personalTouch="Excellence is built through discipline."
        alignment="right"
      />
      <section className="bg-white px-6 lg:px-10 py-6 space-y-10">
        {/* Intro */}
        <div className="flex flex-col lg:flex-row items-center gap-5 p-2">
          <div className="flex-1 ">
            <h2 className="font-bold text-lg text-teal-600">
              JobLink360 | Linking Talent and Opportunity
            </h2>
            <p className="text-black mt-2 text-justify">
              JobLink360, operating under the registered name HAMRO JOB PVT.LTD. is
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
              className="  h-72 hidden md:block "
            />
          </div>
        </div>

        {/* Mission */}
        <div className="flex flex-col lg:flex-row-reverse items-center md:gap-5  p-2">
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
              className=" h-72 hidden md:block"
            />
          </div>
        </div>

        {/* Vision */}
        <div className="flex flex-col lg:flex-row items-center md:gap-5 p-2">
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
              className=" h-72   hidden md:block "
            />
          </div>
        </div>

       
        {/* Why Choose Us */}
        <div className="flex flex-col lg:flex-row-reverse items-center  p-2  md:gap-5">
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
              className=" hidden md:block h-72"
            />
          </div>
        </div>
      </section>
      <h1 className="text-center font-bold text-2xl text-teal-600 p-6">Our Team</h1>
      <Ourteam />
    </>
  );
}
