import React from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, redirect, Navigate } from "react-router-dom";
import Login from './Login';

function FourOhFour() {

  
    return (
        <div>
            <h1>404. That's an error.</h1>

            <p>There was a problem processing your request. That's all we know.</p>
        </div>

    )


}

export default FourOhFour;