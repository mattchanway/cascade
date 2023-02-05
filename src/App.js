// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Jobs from "./components/Jobs";
import UserContext from './components/UserContext';
import JobDetail from './components/JobDetail';
import Navibar from './components/Navbar';
import TimecardsFilterReport from './components/TimecardsFilterReport';
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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import noBgLogo from './assets/no_white_logo.png';

function App() {
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
        let res = await axios.get(`/auth/whoami`);
       
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

 console.log(loggedInUser)

  if (loggedInUser.employeeId === null && loggedInUser.userNotFound === false) return (
    <div>
      <h1>Loading...</h1>
    </div>
  )

  

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={loggedInUser}>
          <Navibar setLoggedInUser={setLoggedInUser} />
          <Routes>
            <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser}></Login>}></Route>
            <Route path="/" element={<Jobs setLoggedInUser={setLoggedInUser}></Jobs>}></Route>
            <Route path="/jobs/new-job" element={<JobForm ></JobForm>} ></Route>
            <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
            <Route path="/report" element={<TimecardsFilterReport></TimecardsFilterReport>}></Route>
            <Route path="/employees/new-employee" element={<EmployeeForm></EmployeeForm>} ></Route>
            <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
            <Route path="/employees" element={<Employees></Employees>} ></Route>
            <Route path="/admin" element={<Admin></Admin>}></Route>
            <Route path="/admin/password" element={<ResetPasswordInternal  loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}></ResetPasswordInternal>} ></Route>
            <Route path="/reset-password/:token" element={<ForgotPasswordReset setLoggedInUser={setLoggedInUser}></ForgotPasswordReset>} ></Route>
            <Route path="/accounts/password/reset" element={<ForgotPasswordModalForm></ForgotPasswordModalForm>} ></Route>
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
