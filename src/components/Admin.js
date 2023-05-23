import React, { useContext } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, redirect, Navigate } from "react-router-dom";
import Login from './Login';

function Admin() {

    let navigate = useNavigate()

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
        
            <Link to="/jobs/new-job">Add a New Job</Link><br></br>
            <Link to="/admin/edit-timecard">Edit a timecard</Link><br></br>
            <Link to="/admin/delete-timecard">Delete a timecard</Link><br></br>
            <Link to="/employees/new-employee">Add a New Employee</Link><br></br>
        </div>

    )





}

export default Admin;