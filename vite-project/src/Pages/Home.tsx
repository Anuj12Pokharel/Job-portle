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
      <div className="front overflow-x-hidden">
        <Jobsearchbanner />
        <div className="pt-8 pb-3 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Find Your Dream Job at <span className="text-cyan-600 bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Hamro Job</span>
          </h1>
        </div>
        <GlobalSearch />
        <LogoSlider />
        {/* Jobs section — sidebar locks in place while scrolling through job lists */}
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-9 px-4 sm:px-6 lg:px-8 py-6 items-start">

          {/* Right Sidebar — sticky: stays locked while job sections are on screen */}
          <div className="w-full lg:w-[25%] xl:w-[22%] flex flex-col gap-4 lg:sticky lg:top-28 self-start">
            <Jobform />
            <Jobcard />
          </div>

          {/* Left — Featured Jobs + Top Jobs each with their own internal scroll */}
          <div className="w-full lg:w-[75%] xl:w-[78%] flex flex-col gap-8">

            {/* Featured Jobs — scrollable container */}
            <div>
              <div className="max-h-[520px] overflow-y-auto pr-1 custom-scrollbar rounded-2xl">
                <JobList category={category} search={search} />
              </div>
            </div>

            {/* Top Jobs — scrollable container */}
            <div>
              <div className="max-h-[520px] overflow-y-auto pr-1 custom-scrollbar rounded-2xl">
                <Topjob category={category} search={search} />
              </div>
            </div>

          </div>
        </div>

        {/* Sections below job listings — scroll normally, sidebar not visible here */}
        <HeroSection />
        <div className="py-7">
          <h1 className="text-center text-2xl font-bold text-cyan-600">
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
