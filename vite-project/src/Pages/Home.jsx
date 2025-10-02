
import Jobsearchbanner from "../components/Jobsearchbanner.jsx";
import Jobportal from '../components/Jobportal.jsx'
import LogoSlider from "../components/LogoSlider.jsx";
import HeroSection from "../components/Home/HeroSection.jsx";
import Workingmethod from "../components/Home/Workingmethod.jsx";
import Jobseeker from "../components/Home/Jobseeker.jsx";
import Employer from "../components/Home/Employer.jsx";
import Topjob from "../components/Home/Topjob.jsx";
import Jobsearch from "../components/Home/Jobsearch.jsx";
import FA from "../components/Home/FA.jsx";
import Training from "../components/Home/Training.jsx";
import JobList from "../components/Job/JobList.jsx";
import RegistrationCards from "../components/Home/RegistrationCards.jsx";
import Jobcard from "../components/Jobcard.jsx";



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
