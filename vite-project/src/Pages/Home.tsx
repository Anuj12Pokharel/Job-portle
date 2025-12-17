import Jobsearchbanner from "../components/Jobsearchbanner";
import Jobportal from "../components/Jobportal";
import LogoSlider from "../components/LogoSlider";
import HeroSection from "../components/Home/HeroSection";
import Workingmethod from "../components/Home/Workingmethod";
import Jobseeker from "../components/Home/Jobseeker";
import Employer from "../components/Home/Employer";
import Topjob from "../components/Home/Topjob";
import Jobsearch from "../components/Home/Jobsearch";
import FA from "../components/Home/FA";
import Training from "../components/Home/Training";
import JobList from "../components/Job/JobList";
import RegistrationCards from "../components/Home/RegistrationCards";
import Jobcard from "../components/Jobcard";

import { useSearchParams } from "react-router-dom";

function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  return (
    <>
      <div className="front">
        <Jobsearchbanner />
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-9 px-4 sm:px-6 lg:px-8 py-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[26%] xl:w-[22%] flex flex-col gap-4">
            <RegistrationCards />
            <Jobcard />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[74%] xl:w-[78%] flex flex-col gap-6">
            <JobList category={category} />
            <Jobportal />
          </div>
        </div>

        <Topjob category={category} />
        <LogoSlider />
        <HeroSection />

        <div className="py-7">
          <h1 className="text-center  text-2xl font-bold text-cyan-600">
            What Makes JOBLINK360 the Best Platform for Jobs in Nepal?
          </h1>
          <Jobseeker />
          <Employer />
        </div>
        <Workingmethod />
      </div>
      <Jobsearch />
      <Training />
      <FA />
    </>
  );
}
export default Home;
