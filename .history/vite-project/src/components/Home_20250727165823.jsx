import Navbar from "./Navbar";
import Jobsearchbanner from "./Jobsearchbanner";
import Jobcard from "./Jobcard";
import Jobportal from './Jobportal'



function Home() {
    return <>
        <Navbar />
        <div className="front" >
            <Jobsearchbanner/>
            <Jobportal/>
            {/* <Jobcard/> */}
            
        </div>
    </>
}
export default Home;