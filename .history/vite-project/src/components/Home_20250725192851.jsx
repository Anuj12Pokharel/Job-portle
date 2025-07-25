import Navbar from "./Navbar";
import Jobsearchbanner from "./Jobsearchbanner";
import Jobcard from "./Jobcard";
import 



function Home() {
    return <>
        <Navbar />
        <div className="front" >
            <Jobsearchbanner/>
            <jobportal/>
            <Jobcard/>
            
        </div>
    </>
}
export default Home;