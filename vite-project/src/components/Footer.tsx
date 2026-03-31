import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

const COMPANY_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/aboutus" },
  { label: "Services", path: "/services/recruitment" },
  { label: "Contact", path: "/contact" },
  { label: "Blog", path: "/blogs" },
  { label: "Training", path: "/training" },
] as const;

const SERVICE_LINKS = [
  { label: "Hiring and Management Tools", path: "/services/job-posting" },
  { label: "Recruitment", path: "/services/recruitment" },
  { label: "Outsourcing", path: "/services/outsourcing" },
  { label: "Payroll Management", path: "/services/payroll-management" },
  { label: "Training and Development", path: "/services/training_and_development" },
  { label: "Corporate Event Management", path: "/services/corporate&eventmanagement" },
  { label: "Human Resource Consulting", path: "/services/hr-consulting" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/share/17v6t4723N/",
    icon: FaFacebookF,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/hamro.job?igsh=MXUycWRodnhpNmdnOQ==",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/hamrojob-joblink360/",
    icon: FaLinkedinIn,
    label: "LinkedIn",
  },
  {
    href: "https://www.tiktok.com/@joblink_360?_r=1&_t=ZS-930NXUSFtau",
    icon: FaTiktok,
    label: "TikTok",
  },
  {
    href: "https://wa.me/qr/RFIPQ4H3MEYAO1",
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
  {
    href: "http://www.youtube.com/@JOBLinK360",
    icon: FaYoutube,
    label: "YouTube",
  },
] as const;

const Footer: React.FC = () => {
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
            the country's evolving employment landscape, we are dedicated to
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
            {COMPANY_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            {SERVICE_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} className="hover:underline block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <IoLocationSharp className="text-cyan-900 text-xl shrink-0" />
              <span>Gopikrishnapul, Chabahil, Kathmandu</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-cyan-900 text-lg shrink-0" />
              <span>
                01-4502062,
                <br /> 9761666636, 9809497136
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-cyan-900 text-lg shrink-0" />
              <span>hamrojob2k23@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
          <div className="flex space-x-4 text-xl">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="cursor-pointer hover:text-cyan-300 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/30 mt-10 pt-6 text-sm flex flex-col lg:flex-row justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} Hamro Job Pvt. Ltd. All rights reserved.
        </p>
        <p className="mt-3 lg:mt-0">
          Designed &amp; Developed by JobLink360 Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
