import React, { useEffect, useState, useContext } from 'react';
import { useLocation, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import UserContext from './UserContext';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import baseURL from '../helpers/constants';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Employees from './Employees';
import InactiveEmployees from './InactiveEmployees';



function EmployeeMasterMenu() {
    const [serverError, setServerError] = useState(false);

    const { employeeId, position, userNotFound } = useContext(UserContext);


    if (position !== 3) {
        return <Navigate to="/unauthorized" replace={true}></Navigate>
     }

     if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div>
                <h1>Employee Directory</h1>
                <Tabs defaultActiveKey="Active">
                <Tab eventKey="Active" title="Active Employees">
                    <Employees></Employees>
                </Tab>
                <Tab eventKey="Inactive" title="Inactive Employees">
                    <InactiveEmployees></InactiveEmployees>
                </Tab>
                </Tabs>
           

        </div>

    )
}

export default EmployeeMasterMenu;