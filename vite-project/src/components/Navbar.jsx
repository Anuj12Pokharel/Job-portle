"use client"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import logo from '../assets/logo.jpeg'
import { Link } from "react-router-dom"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [jobseekerOpen, setJobseekerOpen] = useState(false)
  const [employerOpen, setEmployerOpen] = useState(false)

  const mainNavItems = [ { name: "JOB CATEGORY", path: "/job-category" },
  { name: "SERVICES", path: "/services" },
  { name: "TRAINING", path: "/training" },
  { name: "BLOGS", path: "/blogs" },
  { name: "ABOUT US", path: "/aboutus" },
  { name: "CONTACT US", path: "/contact" }
  ]

  return (
    <div className="bg-white shadow-sm relative">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link
                key={index}
                to={item.path}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Auth Dropdowns */}
          <div className="hidden md:flex items-center space-x-6 relative">

            {/* For Jobseekers */}
            <div className="relative">
  <button
    onClick={() => setJobseekerOpen(!jobseekerOpen)}
    className="flex items-center gap-1 text-lg text-gray-700 hover:text-gray-900 font-medium"
  >
    For Jobseekers <ChevronDown className="w-4 h-4" />
  </button>

  {jobseekerOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <Link
                    to="/Jobseeker-Login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setJobseekerOpen(false)}
                  >
        Login
         </Link>
     <Link
                    to="/Jobseeker-Register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setJobseekerOpen(false)}
                  >
                    Register
                  </Link>
    </div>
  )}
</div>

            
            
            

            {/* For Employers */}
            <div className="relative">
  <button
    onClick={() => setEmployerOpen(!employerOpen)}
    className="flex items-center gap-1 text-lg text-gray-700 hover:text-gray-900 font-medium"
  >
    For Employers <ChevronDown className="w-4 h-4" />
  </button>

  {employerOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <Link
                    to="/Employeer-Login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setEmployerOpen(false)}
                  >
                    Login
                  </Link>
       <Link
                    to="/Employeer-Register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setEmployerOpen(false)}
                  >
                    Register
                  </Link>
    </div>
  )}
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
            <div className="px-4 pt-4 pb-4 space-y-4 bg-gray-50">
              {/* Main Nav */}
              {mainNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-700 hover:text-gray-900 block text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}

              {/* For Jobseekers */}
              <div>
                <button
                  onClick={() => setJobseekerOpen(!jobseekerOpen)}
                  className="w-full flex justify-between items-center text-gray-900 font-semibold text-lg py-2"
                >
                  For Jobseekers
                  <span>{jobseekerOpen ? "▲" : "▼"}</span>
                </button>
                {jobseekerOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    <Link
                      to="/Jobseeker-Login"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => setJobseekerOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/Jobseeker-Register"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => setJobseekerOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* For Employers */}
              <div>
                <button
                  onClick={() => setEmployerOpen(!employerOpen)}
                  className="w-full flex justify-between items-center text-gray-900 font-semibold text-lg py-2"
                >
                  For Employers
                  <span>{employerOpen ? "▲" : "▼"}</span>
                </button>
                {employerOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                   <Link
                      to="/Employeer-Login"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => setEmployerOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/Employeer-Register"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => setEmployerOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
