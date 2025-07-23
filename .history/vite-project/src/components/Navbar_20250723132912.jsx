"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"
import logo from '../assets/logo'

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const mainNavItems = ["JOB CATEGORY", "SERVICES", "TRAINING", "BLOGS", "ABOUT US", "CONTACT US"]

  return (
    <div className="bg-white shadow-sm">
    
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-900">LOGO</span>
             <img src={logo} alt="Logo" className="w-[125px] h-auto px-2" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {mainNavItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <a
                href="#"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                REGISTER
              </a>
               <a
                href="#"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </a>

            </div>
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {mainNavItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  {item}
                </a>
              ))}
              <a
                href="#"
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                REGISTER
              </a>
            </div>
          </div>
        )}
      </nav>

    </div>
  )
}
