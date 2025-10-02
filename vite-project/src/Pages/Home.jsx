
import Jobsearchbanner from "../components/Jobsearchbanner";
import Jobportal from '../components/Jobportal'
import LogoSlider from "../components/LogoSlider";
import HeroSection from "../components/Home/HeroSection";
import Workingmethod from "../components/Home/Workingmethod";
import Jobseeker from "../components/Home/jobseeker";
import Employer from "../components/Home/Employer";
import Topjob from "../components/Home/Topjob";
import Jobsearch from "../components/Home/Jobsearch";
import FA from "../components/Home/FA";
import Training from "../components/Home/Training";
import JobList from "../components/Job/JobList";
import RegistrationCards from "../components/Home/RegistrationCards";
import Jobcard from "../components/Jobcard";



function Home() {
    return <>
        
        <div className="front" >
            <Jobsearchbanner/>
             <div className="flex flex-row-reverse gap-9 p-6">
                    {/* Left Sidebar 20% */}
                    <div className="w-[20%] flex flex-col gap-4">
                        <RegistrationCards />
                        <Jobcard />
                    </div>

                    {/* Main Content 80% */}
                    <div className="w-[80%] flex flex-col gap-6">
                        <JobList />
                        <Jobportal />
                    </div>
                </div>
             
    
            <Topjob/>
            <LogoSlider/>
            <HeroSection/>
           
            <div className="py-7">
                 <h1 className="text-center  text-2xl font-bold text-cyan-600">What Makes JOBLINK360 the Best Platform for Jobs in Nepal?</h1>
            <Jobseeker/>
            <Employer/>
           
            </div>
             <Workingmethod/>
            
        </div>
        <Jobsearch/>
        <Training/>
        <FA/>
    </>
}
export default Home;
