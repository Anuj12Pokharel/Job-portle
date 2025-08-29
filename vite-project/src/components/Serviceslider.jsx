import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle} from "react-icons/io";

const data = [
  {
    name:"Hiring and management tools",
    title:"Simplify Hiring and Workforce Management",
    image:"",
    description:"JobLink Job provides user-friendly tools to help you manage job postings, review applicants, and oversee employee progress, all from a single platform designed for smooth hiring experiences."
  },
  {
    name:"Recruitment",
    title:"Effective Recruitment That Delivers Results",
    image:"",
    description:"Our recruitment services connect you with the best-fit candidates quickly and efficiently. We handle the sourcing, screening, and shortlisting so you can focus on choosing the perfect hire."
  },
  {
    name:"Outsourcing",
    title:"Reliable Outsourcing for Better Productivity",
    image:"",
    description:"Delegate time-consuming tasks to trusted professionals through our outsourcing services. Reduce your workload and operational stress while maintaining high-quality performance."
  },
  {
    name:"Cooperative event management",
    title:"Seamless Management of Cooperative Events",
    image:"",
    description:"Plan and execute training sessions, job fairs, or cooperative gatherings with expert assistance. We take care of logistics and coordination to ensure your event runs smoothly."
  },
  {
    name:"Human resource consulting",
    title:"Strategic HR Consulting for Better Business Practices",
    image:"",
    description:"Enhance your HR operations with guidance from our expert consultants. From improving workplace policies to boosting employee satisfaction, we help align your HR practices with your company’s goals."
  }
];

// Custom Arrow Components
function NextArrow({ onClick }) {
  return (
    <div
      className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 cursor-pointer text-cyan-600 hover:text-cyan-800 z-10"
      onClick={onClick}
    >
      <IoMdArrowDroprightCircle size={22} />
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div
      className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 cursor-pointer text-cyan-600 hover:text-cyan-800 z-10"
      onClick={onClick}
    >
     
       <IoMdArrowDropleftCircle size={22} />
    </div>
  );
}

const Serviceslider = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280, // Large screens (xl)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024, // Tablets (lg)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Small tablets (md)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Mobile (sm)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Hide arrows on very small screens
        },
      },
    ],
  };

  return (
    <div className="w-[90%] m-auto relative">
      <div className="mt-12 ">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div
              key={index}
              className="bg-cyan-500 h-[450px] text-white rounded-xl shadow-lg"
            >
              <div className="h-44 rounded-t-xl bg-teal-600 flex justify-center items-center">
                <img src={d.image} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex flex-col justify-center items-center gap-4 p-4 text-center">
                <p className="font-bold">{d.name}</p>
                <p className="text-lg">{d.title}</p>
                <p className="text-sm">
                  {d.description.length > 100
                    ? d.description.slice(0, 100) + "..."
                    : d.description}
                </p>
                <button className="bg-white text-cyan-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Serviceslider;
