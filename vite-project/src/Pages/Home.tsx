import Jobsearchbanner from "../components/Jobsearchbanner";
import GlobalSearch from "../components/GlobalSearch";
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
import Jobcard from "../components/Jobcard";
import Jobform from "../components/Jobform";

import { useSearchParams } from "react-router-dom";

function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  return (
    <>
      <div className="front overflow-visible">
        <Jobsearchbanner />
        <div className="py-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Find Your Dream Job at <span className="text-cyan-600">Hamro Job Pvt. Ltd.</span>
          </h1>
        </div>
        <GlobalSearch />
        <LogoSlider />
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-9 px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Right Sidebar - Sticky on Desktop */}
          <div className="w-full lg:w-[26%] xl:w-[22%] flex flex-col gap-4 lg:sticky lg:top-32">
            <Jobform />
            <Jobcard />
          </div>
          <div className="w-full lg:w-[74%] xl:w-[78%] flex flex-col gap-6">
            <JobList category={category} search={search} />
          </div>
        </div>
        <Topjob category={category} search={search} />
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
