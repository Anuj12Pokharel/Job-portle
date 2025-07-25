import Navbar from "./Navbar";
import Jobsearchbanner from "./Jobsearchbanner";
import Jobcard from "./Jobcard";



function Home() {
    return <>
        <Navbar />
        <div className="front" >
            <Jobsearchbanner/>
            <F/> 
            <Jobcard/>
            
        </div>
    </>
}
export default Home;