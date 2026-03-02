"use client";
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Settings, Briefcase, LayoutDashboard, Bookmark, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import Categories from "./Job/Categories";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch (e) { setUser(null); }
      } else {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    window.location.assign("/");
  };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobseekerOpen, setJobseekerOpen] = useState(false);
  const [employerOpen, setEmployerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileCategoryOpen(false);
    setJobseekerOpen(false);
    setEmployerOpen(false);
  };


  const mainNavItems = [
    { name: "TRAINING", path: "/training" },
    { name: "BLOGS", path: "/blogs" },
    { name: "ABOUT US", path: "/aboutus" },
    { name: "CONTACT US", path: "/contact" },
  ];

  const categoryRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutsideProfile(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideProfile);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, []);

  const buildImageUrl = (imagePath?: string | null) => {
    if (!imagePath || String(imagePath) === "undefined" || String(imagePath) === "null") return "";
    const cleaned = String(imagePath).replace(/\\/g, "/");
    if (cleaned.startsWith("http")) return cleaned;
    const uploadsIndex = cleaned.indexOf("uploads/");
    const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
    return `${API_BASE_URL}/${relativePath}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50 ">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              {/* Circular Logo */}
              <img
                src={logo}
                alt="JobLink 360 Logo"
                className="h-14 sm:h-16 md:h-18 w-auto"
              />
            </Link>

          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-11">
            <div
              className="relative h-full flex items-center"
              ref={categoryRef}
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-2 relative group ${location.pathname === "/jobs" || location.pathname.startsWith("/jobs/")
                  ? "text-cyan-600 font-semibold"
                  : "text-gray-700 hover:text-cyan-600"
                  }`}
                aria-expanded={categoryOpen}
              >
                JOB CATEGORY
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${location.pathname === "/jobs" || location.pathname.startsWith("/jobs/") ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    to="/jobs"
                    className="block px-4 py-3 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 border-b-2 border-cyan-100 transition"
                    onClick={() => setCategoryOpen(false)}
                  >
                    📋 Browse All Jobs
                  </Link>
                  <Categories onSelect={() => setCategoryOpen(false)} />
                </div>
              )}
            </div>
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`relative group text-sm font-medium transition-colors duration-200 pb-1 ${location.pathname === item.path
                  ? "text-cyan-600 font-semibold"
                  : "text-gray-700 hover:text-cyan-600"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            ))}

            {/* Services Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-2 relative group ${location.pathname.startsWith("/services")
                  ? "text-cyan-600 font-semibold"
                  : "text-gray-700 hover:text-cyan-600"
                  }`}
                aria-expanded={servicesOpen}
              >
                SERVICES
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${location.pathname.startsWith("/services") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">

                  <Link
                    to="/services/recruitment"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Recruitment and Staffing Services
                  </Link>
                  <Link
                    to="/services/outsourcing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Staff Outsourcing
                  </Link>
                  <Link
                    to="/services/payroll-management"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Payroll Management
                  </Link>

                  <Link
                    to="/services/hr-consulting"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Human Resource Consulting
                  </Link>
                  <Link
                    to="/services/training_and_development"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Training and Development
                  </Link>

                  <Link
                    to="/services/job-posting"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Job Posting Platform
                  </Link>
                  <Link
                    to="/services/corporate&eventmanagement"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    onClick={() => setServicesOpen(false)}
                  >
                    Corporate Event Management
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Auth Dropdowns or Profile */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 focus:outline-none p-1.5 rounded-xl transition-all duration-200 hover:bg-gray-50 group"
                >
                  <div className="relative">
                    {user.profilePicture ? (
                      <img
                        src={buildImageUrl(user.profilePicture)}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-400/60 ring-offset-1 group-hover:ring-teal-500 transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{user.fullName || user.companyName}</p>
                    <p className="text-[11px] text-gray-400 leading-tight">Online</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden dropdown-enter">

                    {/* User info header */}
                    <div className="relative px-4 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white">
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={buildImageUrl(user.profilePicture)}
                            alt="Profile"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-white/50"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm leading-tight truncate">{user.fullName || user.companyName}</p>
                          <p className="text-cyan-100 text-xs truncate mt-0.5">{user.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-white/20 text-white/90">
                            {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Employer" : "Job Seeker"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation items */}
                    <div className="py-2">
                      {(user.role === "admin" || user.role === "superadmin") ? (
                        <>
                          <Link
                            to="/employer-profile-settings"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === "/employer-profile-settings"
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              location.pathname === "/employer-profile-settings"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <Settings className="w-4 h-4" />
                            </span>
                            Company Settings
                          </Link>
                          <Link
                            to={user.role === "superadmin" ? "/super-admin-dashboard" : "/admin-dashboard"}
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              (location.pathname === "/admin-dashboard" || location.pathname === "/super-admin-dashboard")
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              (location.pathname === "/admin-dashboard" || location.pathname === "/super-admin-dashboard")
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <LayoutDashboard className="w-4 h-4" />
                            </span>
                            Dashboard
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile-settings"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === "/profile-settings"
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              location.pathname === "/profile-settings"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <Settings className="w-4 h-4" />
                            </span>
                            Profile Settings
                          </Link>
                          <Link
                            to="/applied-jobs"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === "/applied-jobs"
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              location.pathname === "/applied-jobs"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <Briefcase className="w-4 h-4" />
                            </span>
                            Applied Jobs
                          </Link>
                          <Link
                            to="/saved-jobs"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === "/saved-jobs"
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              location.pathname === "/saved-jobs"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <Bookmark className="w-4 h-4" />
                            </span>
                            Saved Jobs
                          </Link>
                          <Link
                            to="/cv-generator"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                              location.pathname === "/cv-generator"
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              location.pathname === "/cv-generator"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              <FileText className="w-4 h-4" />
                            </span>
                            CV Generator
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Divider + Sign Out */}
                    <div className="border-t border-gray-100 px-3 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* For Jobseekers */}
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setJobseekerOpen(true)}
                  onMouseLeave={() => setJobseekerOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors duration-200 py-2"
                    aria-expanded={jobseekerOpen}
                  >
                    For Jobseekers
                    <ChevronDown className={`w-4 h-4 transition-transform ${jobseekerOpen ? "rotate-180" : ""}`} />
                  </button>

                  {jobseekerOpen && (
                    <div className="absolute top-full right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <Link
                        to="/Jobseeker-Login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        to="/Jobseeker-Register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>


                {/* For Employers */}
                <div className="relative h-full flex items-center"
                  onMouseEnter={() => setEmployerOpen(true)}
                  onMouseLeave={() => setEmployerOpen(false)}
                >
                  <button className="flex items-center gap-1 text-lg text-gray-700 hover:text-gray-900 font-medium py-2">
                    For Employers
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${employerOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {employerOpen && (
                    <div className="absolute top-full right-0  w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <Link
                        to="/Employeer-Login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                      >
                        Login
                      </Link>
                      <Link
                        to="/Employeer-Register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-4 space-y-4 bg-gray-50">
              {/* Job Category Dropdown for Mobile */}
              <div>
                <button
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex justify-between items-center text-gray-900 font-semibold text-lg py-2"
                >
                  JOB CATEGORY
                  <span>{mobileCategoryOpen ? "−" : "+"}</span>
                </button>

                {mobileCategoryOpen && (
                  <div className="mt-2 bg-white rounded-md border border-gray-200 shadow-sm">
                    <Link
                      to="/jobs"
                      className="block px-4 py-3 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 border-b-2 border-cyan-100 transition"
                      onClick={() => {
                        setCategoryOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      📋 Browse All Jobs
                    </Link>
                    <Categories onSelect={() => {
                      setCategoryOpen(false);
                      setIsMobileMenuOpen(false);
                    }} />
                  </div>
                )}
              </div>

              {/* Main Nav */}
              {mainNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`block text-base font-medium py-1 border-l-4 pl-3 transition-all duration-200 ${location.pathname === item.path
                    ? "border-cyan-500 text-cyan-600 bg-cyan-50 rounded-r"
                    : "border-transparent text-gray-700 hover:text-cyan-600 hover:border-cyan-300"
                    }`}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/services"
                className={`block text-base font-medium py-1 border-l-4 pl-3 transition-all duration-200 ${location.pathname.startsWith("/services")
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50 rounded-r"
                  : "border-transparent text-gray-700 hover:text-cyan-600 hover:border-cyan-300"
                  }`}
                onClick={closeMobileMenu}
              >
                SERVICES
              </Link>

              {/* For Jobseekers */}
              <div>
                <button
                  onClick={() => setJobseekerOpen(!jobseekerOpen)}
                  className="w-full flex justify-between items-center text-gray-900 font-semibold text-lg py-2"

                >
                  For Jobseekers
                  <span>{jobseekerOpen ? "−" : "+"}</span>
                </button>
                {jobseekerOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    <Link
                      to="/Jobseeker-Login"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => {
                        setJobseekerOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/Jobseeker-Register"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => {
                        setJobseekerOpen(false);
                        closeMobileMenu();
                      }}
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
                  <span>{employerOpen ? "−" : "+"}</span>
                </button>
                {employerOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    <Link
                      to="/Employeer-Login"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => {
                        setEmployerOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/Employeer-Register"
                      className="block text-gray-700 hover:text-gray-900 text-base"
                      onClick={() => {
                        setEmployerOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* User Profile Section for Mobile */}
              {user && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                  {/* Mobile gradient card header */}
                  <div className="relative mx-1 px-4 py-4 rounded-xl bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-500 text-white mb-4 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
                    <div className="relative flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={buildImageUrl(user.profilePicture)}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/40 ring-offset-1 ring-offset-teal-600 shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{user.fullName || user.companyName}</p>
                        <p className="text-cyan-100/80 text-xs truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full bg-white/20 text-white/90">
                          {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Employer" : "Job Seeker"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 px-1">
                    {(user.role === "admin" || user.role === "superadmin") ? (
                      <Link
                        to="/employer-profile-settings"
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${location.pathname === "/employer-profile-settings" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={closeMobileMenu}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === "/employer-profile-settings" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                          <Settings className="w-4 h-4" />
                        </span>
                        Company Settings
                      </Link>
                    ) : (
                      <Link
                        to="/profile-settings"
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${location.pathname === "/profile-settings" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={closeMobileMenu}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === "/profile-settings" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                          <Settings className="w-4 h-4" />
                        </span>
                        Profile Settings
                      </Link>
                    )}
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <Link
                        to={user.role === "superadmin" ? "/super-admin-dashboard" : "/admin-dashboard"}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${(location.pathname === "/admin-dashboard" || location.pathname === "/super-admin-dashboard") ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={closeMobileMenu}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${(location.pathname === "/admin-dashboard" || location.pathname === "/super-admin-dashboard") ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                          <LayoutDashboard className="w-4 h-4" />
                        </span>
                        Dashboard
                      </Link>
                    )}
                    {user.role === "user" && (
                      <>
                        <Link
                          to="/applied-jobs"
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${location.pathname === "/applied-jobs" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                          onClick={closeMobileMenu}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === "/applied-jobs" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                            <Briefcase className="w-4 h-4" />
                          </span>
                          Applied Jobs
                        </Link>
                        <Link
                          to="/saved-jobs"
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${location.pathname === "/saved-jobs" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                          onClick={closeMobileMenu}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === "/saved-jobs" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                            <Bookmark className="w-4 h-4" />
                          </span>
                          Saved Jobs
                        </Link>
                        <Link
                          to="/cv-generator"
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${location.pathname === "/cv-generator" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                          onClick={closeMobileMenu}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === "/cv-generator" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"}`}>
                            <FileText className="w-4 h-4" />
                          </span>
                          CV Generator
                        </Link>
                      </>
                    )}
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-500 bg-red-50/60 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
