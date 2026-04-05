import React from "react";
import { CheckCircle, ArrowRight, Users } from "lucide-react";
import jobseekerImg from "../../assets/professional_jobseeker.png";

const features = [
  "Joblink360 provides free one-on-one career counseling to help individuals plan their career path effectively. ",
  "Jobseekers can attend regular job preparedness workshops focused on resume building, interview techniques, and LinkedIn optimization.",
  "The platform offers direct employer interaction events such as online and offline job fairs and networking sessions. ",
  "Users can upload their CVs and receive instant feedback through an  CV review system. ",
  "Joblink360 assigns a job readiness score to help jobseekers understand their profile strength in the job market.",
  "Access online courses, certifications, and learning materials to strengthen in-demand skills.",
];

const Jobseeker = () => {

  return (
    <section className=" px-6 ">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-xl font-bold mb-6 text-cyan-600">
              For Jobseeker:
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

export default Jobseeker;
