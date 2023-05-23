import React, { useEffect, useState, useContext } from 'react';
import { useLocation, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import UserContext from './UserContext';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import baseURL from '../helpers/constants';



function InactiveEmployees() {
    const [serverError, setServerError] = useState(false);
    const [employees, setEmployees] = useState([]);
    const { employeeId, position, userNotFound } = useContext(UserContext);

    useEffect(() => {

        async function getEmployees() {

            try{
            let res = await axios.get(`${baseURL}/employees/directory/inactive`);
           
            setEmployees(res.data);
            }
            catch(e){
                setServerError(true)
               
            }
        }
        getEmployees();

    }, [])

    if (position !== 3) {
        return <Navigate to="/unauthorized" replace={true}></Navigate>
     }

     if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div>
             
            {employees && <ListGroup className='job-list' as="ul">

                {employees.map((e) => <ListGroup.Item key={e.employee_id} action href={`/employees/${e.employee_id}`}>{e.last_name}, {e.first_name} </ListGroup.Item>)}

            </ListGroup>}

            {/* {jobAddedAlert && <Alert variant={'success'} dismissible onClose={closeSuccessAlert} >Timecard added!</Alert>} */}

        </div>

    )
}

export default InactiveEmployees;