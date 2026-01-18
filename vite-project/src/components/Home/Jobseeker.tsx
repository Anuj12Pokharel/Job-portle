import React, { useRef } from "react";
import { CheckCircle, ArrowRight, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import jobseekerImg from "../../assets/Jobseeker.jpg";

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
    <section ref={ref} className=" px-6 ">
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
         <div className="lg:w-1/2 flex justify-center items-center">
  <img
    src={jobseekerImg}
    alt="Job Seeker Illustration"
    className="w-full max-w-md mx-auto object-contain"
  />
</div>

        </div>
      </div>
    </section>
  );
};

export default Jobseeker;
