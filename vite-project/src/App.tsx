import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import EmployeerRegister from "./Pages/EmployeerRegister";
import EmployeerLogin from "./Pages/EmployeerLogin";
import JobseekerLogin from "./Pages/JobseekerLogin";
import JobseekerRegister from "./Pages/JobseekerRegister";
import AdminDashboard from "./Pages/AdminDashboard";
import SuperAdminDashboard from "./Pages/SuperAdminDashboard";
import SuperAdminLogin from "./Pages/SuperAdminLogin";
import Contactus from "./Pages/Contactus";
import Aboutus from "./Pages/Aboutus";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Services from "./Pages/Services/Services";
import Corporate from "./Pages/Services/Corporate";
import Hiring from "./Pages/Services/Hiring";
import Outsourcing from "./Pages/Services/Outsourcing";
import Recruitment from "./Pages/Services/Recruitment";
import Resource from "./Pages/Services/Resource";
import Training from "./Pages/Services/Training";
import Trainings from "./Pages/Trainings";
import Blog from "./Pages/Blog";
import Customerservice from "./Pages/Training/Customerservice";
import ProfileSettings from "./Pages/ProfileSettings";
import ForgotPassword from "./components/ForgotPassword";
import ForgotPasswordEmployer from "./components/ForgotPasswordEmployer";
import JobDetails from "./Pages/JobDetails";
import ApplyJob from "./Pages/ApplyJob";
import AppliedJobs from "./Pages/AppliedJobs";
import SavedJobs from "./Pages/SavedJobs";
import RegistrationPending from "./Pages/RegistrationPending";
import Jobs from "./Pages/Jobs";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/jobs" element={<Jobs />}></Route>
        <Route path="/saved-jobs" element={<SavedJobs />}></Route>
        <Route
          path="/Employeer-Register"
          element={<EmployeerRegister />}
        ></Route>
        <Route path="/Employeer-Login" element={<EmployeerLogin />}></Route>
        <Route path="/Jobseeker-Login" element={<JobseekerLogin />}></Route>
        <Route
          path="/Jobseeker-Register"
          element={<JobseekerRegister />}
        ></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />}></Route>
        <Route path="/super-admin-login" element={<SuperAdminLogin />}></Route>
        <Route path="/contact" element={<Contactus />}></Route>
        <Route path="/aboutus" element={<Aboutus />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route
          path="/services/corporate&eventmanagement"
          element={<Corporate />}
        ></Route>
        <Route path="/services/hiring-tools" element={<Hiring />}></Route>
        <Route path="/services/outsourcing" element={<Outsourcing />}></Route>
        <Route path="/services/recruitment" element={<Recruitment />}></Route>
        <Route path="/services/hr-consulting" element={<Resource />}></Route>
        <Route
          path="/services/training_and_development"
          element={<Training />}
        ></Route>
        <Route path="/training" element={<Trainings />}></Route>
        <Route
          path="/training/customerservice"
          element={<Customerservice />}
        ></Route>
        <Route path="/profile-settings" element={<ProfileSettings />}></Route>
        <Route path="/blogs" element={<Blog />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/forgot-password-employer"
          element={<ForgotPasswordEmployer />}
        ></Route>
        <Route path="/jobs/:id" element={<JobDetails />}></Route>
        <Route path="/apply-job/:id" element={<ApplyJob />}></Route>
        <Route path="/applied-jobs" element={<AppliedJobs />}></Route>
        <Route path="/registration-pending" element={<RegistrationPending />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
