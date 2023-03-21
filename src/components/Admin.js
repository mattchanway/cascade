import React, { useContext } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, redirect, Navigate } from "react-router-dom";
import Login from './Login';

function Admin() {


    const { employeeId, position, firstName, lastName, userNotFound } = useContext(UserContext);


    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
     }

     if (employeeId !== null && position !== 3) {
        return <Navigate to="/unauthorized" replace={true}></Navigate>
  
     }
       
    
    return (
        <div>
            <h1>Admin</h1>
            <h2>Job Admin</h2>
            <Link to="/jobs/new-job">Add a New Job</Link><br></br>
            <h2>Employee Admin</h2>
            <Link to="/employees/new-employee">Add a New Employee</Link><br></br>
        </div>

    )





}

export default Admin;