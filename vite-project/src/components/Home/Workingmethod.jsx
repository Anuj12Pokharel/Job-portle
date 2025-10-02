// src/components/Workingmethod.jsx
import React,{ useRef } from 'react';

import Advancejob from '../../assets/Advancejob.png';
import careeropor from '../../assets/careeropor.png';
import Realtime from '../../assets/Realtime.png';
import Premium from '../../assets/Premium.png';

import { motion, useInView } from 'framer-motion';


const steps = [
  {
    title: 'Advanced Job Search Functionality',
    description: 'Search for job vacancies easily with advanced filters by sector, location, job category, and experience level allowing you to search for jobs that best match your professional resume.',
    image: Advancejob,
  },
  {
    title: 'Extensive Career Opportunities',
    description: ' From junior-level job vacancies to top executive jobs, JOBLINK360 provides a complete set of job listings, meeting the needs of professionals at every level of their career path.',
    image: careeropor,
  },
  {
    title: 'Real-Time Job Alerts',
    description: 'Get notified immediately via email and SMS the moment new job vacancies that meet your search criteria are posted, so you do not miss any possible opportunity.',
    image: Realtime,
  },
  {
    title: 'Exclusive Access to Premium Listings',
    description: ' Get access to top-level job vacancies available exclusively on JOBLINK360, trusted by leading employers across Nepal for quality talent acquisition.',
    image: Premium,
  },
  
];
const containerVariants = {
  hidden: {}, // no animation needed on container itself
  visible: {
    transition: {
      staggerChildren: 0.9, // children appear one by one, each delayed by 0.3s
    }
  }
};

// Child variants define how each feature animates
const childVariants = {
  hidden: { x: -200, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
};



const Workingmethod = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section className="w-screen bg-gradient-to-br from-white via-sky-50 to-white text-black p-6 ">
      <div className="px-6 max-w-[1400px] mx-auto">
        <h2 className="text-2xl text-cyan-600 font-bold text-center mb-12">
         Your Path to Employment in Nepal Starts with JOBLINK360
        </h2>
        <motion.div 
        ref={ref} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        
        variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}>
                

          {steps.map((step, index) => (
            <motion.div
            key={index}
             className="text-center p-4 bg-white rounded-xl shadow"
              variants={childVariants}  >
            
              <img
                src={step.image}
                alt={step.title}
                className="w-20 h-20 mx-auto mb-3 object-contain"
              />
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Workingmethod;
