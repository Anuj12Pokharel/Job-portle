import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import EmployeerRegister from './Pages/EmployeerRegister';
import EmployeerLogin from './Pages/EmployeerLogin';
import JobseekerLogin from './Pages/JobseekerLogin';
import JobseekerRegister from './Pages/JobseekerRegister';
import AdminDashboard from './Pages/AdminDashboard';
import Contactus from './Pages/Contactus';
import Ourteam from './Pages/Ourteam';
import Aboutus from './Pages/Aboutus';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Services from './Pages/Services/Services';
import Corporate from './Pages/Services/Corporate';
import Hiring from './Pages/Services/Hiring';
import Outsourcing from './Pages/Services/Outsourcing';
import Recruitment from './Pages/Services/Recruitment';
import Resource from './Pages/Services/Resource';
import Training from './Pages/Services/Training';





function App() {


  return <>
<Navbar/>
    <Routes>
      <Route path='/' element={<Home />}></Route>
       <Route path='/Employeer-Register' element={<EmployeerRegister/>}></Route>
              <Route path='/Employeer-Login' element={<EmployeerLogin/>}></Route>
               <Route path='/Jobseeker-Login' element={<JobseekerLogin/>}></Route>
                <Route path='/Jobseeker-Register' element={<JobseekerRegister/>}></Route>
                 <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
                   <Route path='/contact' element={<Contactus/>}></Route>
                     <Route path='/aboutus' element={<Aboutus/>}></Route>
                      <Route path='/services' element={<Services/>}></Route>
                       <Route path='/services/corporate&eventmanagement' element={<Corporate/>}></Route>
                        <Route path='/services/hiring-tools' element={<Hiring/>}></Route>
                         <Route path='/services/outsourcing' element={<Outsourcing/>}></Route>
                          <Route path='/services/recruitment' element={<Recruitment/>}></Route>
                           <Route path='/services/hr-consulting' element={<Resource/>}></Route>
                            <Route path='/services/training_and_development' element={<Training/>}></Route>


                   
                     
                   
                 

                 


      
      
    </Routes>
<Footer/>

  </>
}
export default App;