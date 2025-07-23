"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import logo from '../assets/logo.jpeg'

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const mainNavItems = ["JOB CATEGORY", "SERVICES", "TRAINING", "BLOGS", "ABOUT US", "CONTACT US"]

  return (
    <div className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-200">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-11">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="#"
              className="  px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
            >
              For Jobsekeers
            </a>
            <a
              href="#"
              className=" px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
            >
              For Employers
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-4 space-y-2 bg-gray-50">
              {mainNavItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-700 hover:text-gray-900 block text-base font-medium"
                >
                  {item}
                </a>
              ))}
              <a
                href="#"
                className="bg-blue-600 text-white block px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                REGISTER
              </a>
              <a
                href="#"
                className="bg-blue-600 text-white block px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Login
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
