import Navbar from "./Navbar";
import Jobsearchbanner from "./Jobsearchbanner";
import J from "./Jobcard";



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