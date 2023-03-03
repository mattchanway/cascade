// import '../css/App.css';
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import UserContext from './UserContext';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import baseURL from '../helpers/constants';



function Employees() {
    const [serverError, setServerError] = useState(false);
    const [employees, setEmployees] = useState([]);
    const { employeeId, position, userNotFound } = useContext(UserContext);

    useEffect(() => {

        async function getEmployees() {

            try{
            let res = await axios.get(`${baseURL}/employees`);
           
            setEmployees(res.data);
            }
            catch(e){
               
            }
        }
        getEmployees();

    }, [])

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
     }

     if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div>
                <h1>Employee Directory</h1>
            {employees && <ListGroup className='job-list' as="ul">

                {employees.map((e) => <ListGroup.Item action href={`/employees/${e.employee_id}`}>{e.last_name}, {e.first_name} </ListGroup.Item>)}

            </ListGroup>}

            {/* {jobAddedAlert && <Alert variant={'success'} dismissible onClose={closeSuccessAlert} >Timecard added!</Alert>} */}

        </div>

    )
}

export default Employees;