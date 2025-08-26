import React from 'react';
import {
  FaFacebookF,  FaInstagram,  FaLinkedinIn,  FaWhatsapp, FaTiktok, FaPhone,
  FaEnvelope
} from 'react-icons/fa';

import { IoLocationSharp } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-cyan-600 text-white py-12 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Logo + Description */}
        <div>
         
          <p className="mt-4 text-sm leading-relaxed text-white">
            Delivering expert solutions right to your home — quick, dependable, and trusted by countless Employeers and Jobseekers.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-white">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Contact</a></li>
                <li><a href="#">Blog</a></li>
                    <li><a href="#">Trainning</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Services</h3>
          <ul className="space-y-2 text-sm text-white">
            <li>Vision</li>
            <li>Mission</li>
            <li>Intelligence</li>
            <li>Others</li>
          
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-white">
            
             <div className="flex items-center gap-2">
                     <IoLocationSharp className="text-lime-600 text-xl font-bold" />
                       <span>Balkumari,Kathmandu</span>
                     </div>

            <div className="flex items-center gap-2">
                        <FaPhone className="text-lime-600 text-xl" />
                        <span>+977 1234567890</span>
                      </div>
            <div className="flex items-center gap-2">
                       <FaEnvelope className="text-lime-600 text-xl" />
                       <span>jobLink360@gmail.com</span>
                     </div>
             
           
          
          </ul>
        </div>


       
        {/* Social + Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
          <div className="flex space-x-3 mb-5 text-white text-xl">
            
           <a href="" target="_blank" rel="noopener noreferrer">
    <FaFacebookF />
  </a>
  <a href="" target="_blank" rel="noopener noreferrer">
    <FaInstagram />
  </a>
  <a href="" target="_blank" rel="noopener noreferrer">
    <FaLinkedinIn />
  </a>
  <a href="" target="_blank" rel="noopener noreferrer">
    <FaTiktok />
  </a>
  <a href="" target="_blank" rel="noopener noreferrer">
    <FaWhatsapp />
  </a>
          
          </div>

         
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-10 pt-6 text-sm text-white flex flex-col lg:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} JobLink360. All rights reserved.</p>
        <div className="space-x-4 mt-4 lg:mt-0">
          <p>All Rights Reserved | Designed & Developed by JobLink360 Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
