// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Jobs from "./components/Jobs";
import UserContext from './components/UserContext';
import JobDetail from './components/JobDetail';
import Navibar from './components/Navbar';
import TimecardsFilterReportForm from './components/TimecardsFilterReportForm';
import axios from "axios";
import EmployeeDetail from './components/EmployeeDetail';
import Admin from "./components/Admin"
import Login from './components/Login';
import JobForm from './components/JobForm';
import EmployeeForm from './components/EmployeeForm';
import Employees from './components/Employees';
import ResetPasswordInternal from './components/ResetPasswordInternal';
import ForgotPasswordReset from './components/ForgotPasswordReset';
import ForgotPasswordModalForm from './components/ForgotPasswordModalForm';
import FourOhFour from './components/FourOhFour';
import Spinner from './components/Spinner';
import SummaryReport from './components/SummaryReport';
import baseURL from './helpers/constants';
import Unauthorized from './components/Unauthorized';
import MyTimecards from './components/MyTimecards';
import MultiSiteTimecardForm from './components/MultiSiteTimecardForm';
import EmployeeMasterMenu from './components/EmployeeMasterMenu';
import ReportsList from './components/ReportsList';
import DeleteTimecard from './components/DeleteTimecard'

function App() {
  axios.defaults.withCredentials = true;
  

  const [loggedInUser, setLoggedInUser] = useState({
    employeeId: null,
    position: null,
    firstName: null,
    lastName: null,
    userNotFound: false,
    firstLogin: null,
    passwordReset: false
  });

  useEffect(() => {

    async function whoAmI() {
      try {
        let res = await axios.get(`${baseURL}/auth/whoami`);

        if (res.data.noUser) setLoggedInUser({
          employeeId: null,
          position: null,
          firstName: null,
          lastName: null,
          userNotFound: true,
          firstLogin: null
        });
        else {
          setLoggedInUser({
            employeeId: res.data.employee_id,
            position: res.data.position,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            userNotFound: false,
            firstLogin: res.data.first_login
          });
        }

      }

      catch (e) {
        console.log(e);
      }
    }
    whoAmI();

  }, [])


  async function doLogout() {

    await axios.post(`${baseURL}/auth/logout`);
    setLoggedInUser({
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true
      })

      return (<Navigate to="/login"></Navigate>)
      
}
 

  if (loggedInUser.employeeId === null && loggedInUser.userNotFound === false) return (
    <Spinner></Spinner>
  )



  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={loggedInUser}>
          <Navibar setLoggedInUser={setLoggedInUser} doLogout={doLogout} />
          <Routes>
            <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser}></Login>}></Route>
            <Route path="/" element={<Jobs setLoggedInUser={setLoggedInUser}></Jobs>}></Route>
            <Route path="/add-multiple-timecards" element={<MultiSiteTimecardForm></MultiSiteTimecardForm>}></Route>
            <Route path="/jobs/new-job" element={<JobForm ></JobForm>} ></Route>
            <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
            <Route path="/reports" element={<ReportsList></ReportsList>}></Route>
            <Route path="/reports/employee-timecard" element={<TimecardsFilterReportForm></TimecardsFilterReportForm>}></Route>
            <Route path="/reports/job-summary" element={<SummaryReport></SummaryReport>}></Route>
            <Route path="/employees/new-employee" element={<EmployeeForm></EmployeeForm>} ></Route>
            <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
            <Route path="/admin/delete-timecard" element={<DeleteTimecard></DeleteTimecard>}></Route>
            <Route path="/admin" element={<Admin></Admin>}></Route>
            <Route path="/employees" element={<EmployeeMasterMenu></EmployeeMasterMenu>}></Route>
            <Route path="/admin/password" element={<ResetPasswordInternal loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}></ResetPasswordInternal>} ></Route>
            <Route path="/reset-password/:token" element={<ForgotPasswordReset setLoggedInUser={setLoggedInUser}></ForgotPasswordReset>} ></Route>
            <Route path="/accounts/password/reset" element={<ForgotPasswordModalForm></ForgotPasswordModalForm>} ></Route>
            <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
            <Route path="/my-profile" element={<MyTimecards></MyTimecards>}></Route>
            <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>
            
          </Routes>

        </UserContext.Provider>
      </BrowserRouter>

      {/* <div id='footer-logo-wrapper'>
    <img id='footer-logo' src={noBgLogo}></img>
    </div> */}
    </div>
  );
}

export default App;
