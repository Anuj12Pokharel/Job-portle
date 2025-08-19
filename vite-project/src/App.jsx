import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import EmployeerRegister from './Pages/EmployeerRegister';
import EmployeerLogin from './Pages/EmployeerLogin';
import JobseekerLogin from './Pages/JobseekerLogin';
import JobseekerRegister from './Pages/JobseekerRegister';





function App() {


  return <>

    <Routes>
      <Route path='/' element={<Home />}></Route>
       <Route path='/Employeer-Register' element={<EmployeerRegister/>}></Route>
              <Route path='/Employeer-Login' element={<EmployeerLogin/>}></Route>
               <Route path='/Jobseeker-Login' element={<JobseekerLogin/>}></Route>
                <Route path='/Jobseeker-Register' element={<JobseekerRegister/>}></Route>

      
      
    </Routes>


  </>
}
export default App;