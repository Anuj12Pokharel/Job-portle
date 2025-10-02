import { Briefcase, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegistrationCards() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-11">
      {/* Company Registration */}
      <Link
        to="/Employeer-Register"
        className="flex items-center gap-4 bg-teal-700 text-white px-8 py-6 rounded-lg shadow-lg w-80 cursor-pointer hover:bg-teal-800 transition"
      >
        <Briefcase size={32} />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">COMPANY</span>
          <span className="text-lg font-semibold">REGISTRATION</span>
        </div>
      </Link>

      {/* Employee Registration */}
      <Link
        to="/Jobseeker-Register"
        className="flex items-center gap-4 bg-cyan-500 text-white px-8 py-6 rounded-lg shadow-lg w-80 cursor-pointer hover:bg-cyan-700 transition"
      >
        <UserPlus size={32} />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">JOBSEEKER</span>
          <span className="text-lg font-semibold">REGISTRATION</span>
        </div>
      </Link>
    </div>
  );
}
