import React, { useRef } from "react";
import { CheckCircle, ArrowRight, Users, Building } from "lucide-react";
import { motion, useInView } from "framer-motion";
import jobseekerImg from "../../assets/Employeer.jpg";

const features = [
  "Joblink360 uses smart technology to quickly suggest the best candidates for job openings.  ",
  "Employers can access a verified database of jobseekers with pre-screened and background-checked profiles. ",
  "The platform includes an interview scheduling tool that helps employers manage interviews efficiently.  ",
  "A custom employer dashboard provides real-time data on hiring stats, applicant flow, and recruitment performance. ",
  "Job openings are promoted across Joblink360 social media channels to increase visibility and reach.",
  "Employers gain access to a pool of verified jobseekers with reliable and background-checked profiles.",
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

const Employer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // animate only once when visible

  return (
    <section className="py-10 px-10 " ref={ref}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-xl font-bold mb-6 text-teal-600">
              For Employer:
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

export default Employer;
