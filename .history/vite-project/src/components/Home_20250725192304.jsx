import Navbar from "./Navbar";
import Jobsearchbanner from "./Jobsearchbanner";
import Jobcard from "./Jobcard";
import Form fro



function Home() {
    return <>
        <Navbar />
        <div className="front" >
            <Jobsearchbanner/>
            <Form/>
            <Jobcard/>
            
        </div>
    </>
}
export default Home;