import React, { useRef } from "react";
import { CheckCircle, ArrowRight, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";

const features = [
  "Joblink360 provides free one-on-one career counseling to help individuals plan their career path effectively. ",
  "Jobseekers can attend regular job preparedness workshops focused on resume building, interview techniques, and LinkedIn optimization.",
  "The platform offers direct employer interaction events such as online and offline job fairs and networking sessions. ",
  "Users can upload their CVs and receive instant feedback through an automated CV review system. ",
  "Joblink360 assigns a job readiness score to help jobseekers understand their profile strength in the job market.",
  "Access online courses, certifications, and learning materials to strengthen in-demand skills and boost employability.",
];

// Container variants control staggered children animation
const containerVariants = {
  hidden: {}, // no animation needed on container itself
  visible: {
    transition: {
      staggerChildren: 0.3, // children appear one by one, each delayed by 0.3s
    },
  },
};

// Child variants define how each feature animates
const childVariants = {
  hidden: { x: -200, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8 } },
};

const Jobseeker = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // animate only once when visible

  return (
    <section className="py-10 px-10 " ref={ref}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-xl font-bold mb-6 text-cyan-600">
              For Jobseeker:
            </h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  variants={childVariants}
                >
                  <CheckCircle className="h-5 w-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-black dark:text-black">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="lg:w-1/2 ">
            <div className="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-16 w-16 text-cyan-600" />
                </div>

                <h3 className="text-xl font-semibold mb-4">For Job Seekers</h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create your profile, showcase your skills, and get discovered
                  by top employers in Nepal.
                </p>

                <button className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jobseeker;
