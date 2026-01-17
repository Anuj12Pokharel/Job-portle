import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { Link } from "react-router-dom";
import type { NavigationOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const data = [
  {
    name: "Hiring and management tools",
    title: "Simplify Hiring and Workforce Management",
    description:
      "JobLink Job provides user-friendly tools to help you manage job postings, review applicants, and oversee employee progress, all from a single platform designed for smooth hiring experiences.",
    link: "/services/hiring-tools",
  },
  {
    name: "Recruitment",
    title: "Effective Recruitment That Delivers Results",
    description:
      "Our recruitment services connect you with the best-fit candidates quickly and efficiently. We handle the sourcing, screening, and shortlisting so you can focus on choosing the perfect hire.",
    link: "/services/recruitment",
  },
  {
    name: "Outsourcing",
    title: "Reliable Outsourcing for Better Productivity",
    description:
      "Delegate time-consuming tasks to trusted professionals through our outsourcing services. Reduce your workload and operational stress while maintaining high-quality performance.",
    link: "/services/outsourcing",
  },
  {
    name: "Cooperative event management",
    title: "Seamless Management of Cooperative Events",
    description:
      "Plan and execute training sessions, job fairs, or cooperative gatherings with expert assistance. We take care of logistics and coordination to ensure your event runs smoothly.",
    link: "/services/corporate&eventmanagement",
  },
  {
    name: "Human resource consulting",
    title: "Strategic HR Consulting for Better Business Practices",
    description:
      "Enhance your HR operations with guidance from our expert consultants. From improving workplace policies to boosting employee satisfaction, we help align your HR practices with your companyG��s goals.",
    link: "/services/hr-consulting",
  },
];

const Serviceslider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full m-auto relative py-2 px-11">
      <h1 className="text-center font-bold text-3xl text-cyan-600">
        Our Services
      </h1>

      <div className="relative mt-12">
        {/* Custom Arrows */}
        <div
          ref={prevRef}
          className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-800 cursor-pointer z-10"
        >
          <IoMdArrowDropleftCircle size={40} />
        </div>
        <div
          ref={nextRef}
          className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-800 cursor-pointer z-10"
        >
          <IoMdArrowDroprightCircle size={40} />
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            const navigation = swiper.params
              .navigation as NavigationOptions;
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            640: { slidesPerView: 1 }, // mobile
            768: { slidesPerView: 2 }, // tablet
            1024: { slidesPerView: 3 }, // laptop
            1280: { slidesPerView: 3 }, // large screens
          }}
        >
          {data.map((d, index) => (
            <SwiperSlide key={index}>
              <div className="bg-teal-600 h-auto text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col justify-center items-center gap-4 p-6 text-center">
                  <p className="font-bold text-xl mt-2">{d.name}</p>
                  <p className="text-lg">{d.title}</p>
                  <p className="text-sm">
                    {d.description.length > 100
                      ? d.description.slice(0, 100) + "..."
                      : d.description}
                  </p>
                  <Link
                    to={d.link}
                    className="bg-white text-cyan-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Serviceslider;
