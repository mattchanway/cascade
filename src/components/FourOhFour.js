import React, { useContext } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, redirect, Navigate } from "react-router-dom";
import Login from './Login';

function FourOhFour() {

    const { employeeId, position, firstName, lastName, userNotFound } = useContext(UserContext);
    
    return (
        <div>
            <h1>404. That's an error.</h1>
        </div>

    )


}

export default FourOhFour;