import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaYoutube
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-cyan-600 text-white py-12 px-4 lg:px-9">
      {/* MAIN GRID */}
      <div className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-10">


        {/* ABOUT */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-3">About JobLink360</h3>
          <p className="text-sm leading-6 text-white/90 text-justify">
            JobLink360, operating under the registered name{" "}
            <span className="font-bold text-red-400 underline">
              Hamro Job Pvt. Ltd.
            </span>
            , is a rapidly growing recruitment company in Nepal, specializing in
            professional HR services. Established with a deep understanding of
            the country’s evolving employment landscape, we are dedicated to
            connecting talented individuals with the right employers. At
            JobLink360, we prioritize professionalism, client satisfaction, and
            long-term partnerships.
          </p>

        </div>


        {/* COMPANY */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-left sm:text-center">
            Company
          </h3>

          <ul className="space-y-2 text-sm text-left sm:text-center">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/services" className="hover:underline">Services</a></li>
            <li><a href="/team" className="hover:underline">Team</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/blogs" className="hover:underline">Blog</a></li>
            <li><a href="/training" className="hover:underline">Training</a></li>
          </ul>
        </div>


        {/* SERVICES */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Hiring and Management Tools</li>
            <li>Recruitment</li>
            <li>Outsourcing</li>
            <li>Payroll Management</li>
            <li>Training and Development</li>
            <li>Corporate Event Management</li>
            <li>Human Resource Consulting</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <IoLocationSharp className="text-cyan-900 text-xl" />
              <span>Chabahil, Kathmandu</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-cyan-900 text-lg space-y-2" />
              <span>01-4502062,
                <br /> 9761666636, 9809497136
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-cyan-900 text-lg" />
              <span>hamrojob2k23@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
            <div className="flex space-x-4 text-xl">
              <a href="https://www.facebook.com/share/17v6t4723N/" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="cursor-pointer hover:text-cyan-300" />
              </a>
              <a href="https://www.instagram.com/hamro.job?igsh=MXUycWRodnhpNmdnOQ==" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="cursor-pointer hover:text-cyan-300" />
              </a>
              <a href="https://www.linkedin.com/company/hamrojob-joblink360/" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="cursor-pointer hover:text-cyan-300" />
              </a>
              <a href="https://www.tiktok.com/@joblink_360?_r=1&_t=ZS-930NXUSFtau" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="cursor-pointer hover:text-cyan-300" />
              </a>
              <a href="https://wa.me/qr/RFIPQ4H3MEYAO1" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="cursor-pointer hover:text-cyan-300" />
              </a>
              <a href="http://www.youtube.com/@JOBLinK360" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="cursor-pointer hover:text-cyan-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/30 mt-10 pt-6 text-sm flex flex-col lg:flex-row justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} Hamro Job PVT.LTD. All rights reserved.
        </p>
        <p className="mt-3 lg:mt-0">
          Designed & Developed by JobLink360 Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
