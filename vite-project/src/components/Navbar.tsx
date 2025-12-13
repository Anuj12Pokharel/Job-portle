"use client";
import { Menu, X, ChevronDown, UserCircle2, LogOut, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import logo from "../assets/logo.jpeg";
import { API_BASE_URL } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import Categories from "./Job/Categories";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobseekerOpen, setJobseekerOpen] = useState(false);
  const [employerOpen, setEmployerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const jobseekerRef = useRef<HTMLDivElement | null>(null);
  const employerRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    authUser?.fullName || authUser?.companyName || authUser?.email || "User";

  const avatarUrl = useMemo(() => {
    const raw =
      authUser?.profilePicture ||
      authUser?.avatar ||
      authUser?.photo ||
      authUser?.logo || // employer logo if returned
      "";
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    const sanitized = raw.replace(/^\/+/, "");
    return `${API_BASE_URL}/${sanitized}`;
  }, [authUser]);

  const initials = useMemo(() => {
    const name = displayName || "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName]);

  // Load auth state from localStorage
  useEffect(() => {
    const loadAuth = () => {
      const token = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");
      if (token && rawUser) {
        try {
          setAuthUser(JSON.parse(rawUser));
        } catch (_e) {
          setAuthUser(null);
        }
      } else if (token) {
        // token present but no stored profile
        setAuthUser({});
      } else {
        setAuthUser(null);
      }
    };

    loadAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") loadAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoryOpen && categoryRef.current && !categoryRef.current.contains(target)) {
        setCategoryOpen(false);
      }
      if (servicesOpen && servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
      if (jobseekerOpen && jobseekerRef.current && !jobseekerRef.current.contains(target)) {
        setJobseekerOpen(false);
      }
      if (employerOpen && employerRef.current && !employerRef.current.contains(target)) {
        setEmployerOpen(false);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen, servicesOpen, jobseekerOpen, employerOpen, userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const mainNavItems = [
    { name: "TRAINING", path: "/training" },
    { name: "BLOGS", path: "/blogs" },
    { name: "ABOUT US", path: "/aboutus" },
    { name: "CONTACT US", path: "/contact" },
  ];

  return (
    <div className="bg-white shadow-sm relative">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-gray-200">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-11">
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                JOB CATEGORY
                <ChevronDown className="w-4 h-4" />
              </button>

              {categoryOpen && (
                <div className="absolute left-0 mt-2 w-[320px] sm:w-[360px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
                  <Categories />
                </div>
              )}
            </div>
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <Link
                to="/services"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                SERVICES
              </Link>

              <button onClick={() => setServicesOpen(!servicesOpen)}>
                <ChevronDown className="w-4 h-4 translate-y-1  " />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    to="/services/hiring-tools"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Hiring & Management Tools
                  </Link>
                  <Link
                    to="/services/recruitment"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Recruitment
                  </Link>
                  <Link
                    to="/services/outsourcing"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Outsourcing
                  </Link>
                  <Link
                    to="/services/corporate&eventmanagement"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Corporate event management
                  </Link>
                  <Link
                    to="/services/hr-consulting"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Human resource consulting
                  </Link>
                  <Link
                    to="/services/training_and_development"
                    className="block px-4 py-1 text-sm text-black hover:bg-gray-100"
                    onClick={() => setServicesOpen(false)}
                  >
                    Training and development
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Auth Dropdowns */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {authUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-lg text-gray-700 hover:text-gray-900 font-medium"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-cyan-100 border border-cyan-200 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-cyan-700 text-sm font-semibold">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold">{displayName}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {displayName}
                      </p>
                      {authUser?.email && (
                        <p className="text-xs text-gray-500">{authUser.email}</p>
                      )}
                    </div>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate("/profile-settings");
                        setUserMenuOpen(false);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* For Jobseekers */}
                <div className="relative" ref={jobseekerRef}>
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
                <div className="relative" ref={employerRef}>
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
              {authUser && (
                <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-100 border border-cyan-200 flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-cyan-700 text-base font-semibold">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {displayName}
                      </p>
                      {authUser?.email && (
                        <p className="text-xs text-gray-500">{authUser.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Link
                      to="/profile-settings"
                      className="text-xs text-cyan-700 font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
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
              <Link
                to="/services"
                className="text-gray-700 hover:text-gray-900 block text-base font-medium"
              >
                SERVICES
              </Link>

              {!authUser && (
                <>
                  {/* For Jobseekers */}
                  <div>
                    <button
                      onClick={() => setJobseekerOpen(!jobseekerOpen)}
                      className="w-full flex justify-between items-center text-gray-900 font-semibold text-lg py-2"
                    >
                      For Jobseekers
                      <span>{jobseekerOpen ? "G��" : "G�+"}</span>
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
                      <span>{employerOpen ? "G��" : "G�+"}</span>
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
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
