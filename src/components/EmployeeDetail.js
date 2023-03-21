import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useLocation, useParams, useNavigate, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import baseURL from '../helpers/constants';
import Unauthorized from './Unauthorized';




function EmployeeDetail() {
    let { id } = useParams();
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [employee, setEmployee] = useState([]);
    const [timecardResults, setTimecardResults] = useState([]);
    const [serverError, setServerError] = useState(false);

   


    useEffect(() => {

        async function getEmployee() {
            try {
                let res = await axios.get(`${baseURL}/employees/${id}`);
              
                setEmployee(res.data.userData);
                setTimecardResults(res.data.timecardsData)
           
            }
            catch (e) {

                setServerError(true);
            }
        }
        getEmployee();
    }, []);



    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    if(serverError === true){
  
        return <Navigate to="/404" replace={true}></Navigate>
    }

    if(employeeId !== null && position !== 3 && employeeId !== +id){
        console.log('oops')
        return <Navigate to="/unauthorized" replace ={true}></Navigate>
    }


  

        return (
            <div>
                {employee && <h1>{employee.first_name} {employee.last_name}</h1>}
                {employee && <h5>{employee.position_name}</h5>}
                {employee && <h5>{employee.certification_name}</h5>}
                {employee && <p>{employee.employee_id}</p>}
                <h2>{timecardResults && timecardResults.length ? 'All Timecards - Last 30 Days' : 'No timecards in last 30 days'}</h2>
                {timecardResults && timecardResults.length > 0 &&
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Timecard Date</th>
                                <th>Job Number</th>
                                <th>Job Name</th>
                                <th>Reg Time</th>
                                <th>Overtime</th>
                                <th>Expenses</th>
                                <th>Notes</th>
                                <th>Submitted At</th>

                            </tr>
                        </thead>
                        <tbody>
                            {timecardResults.map(t =>
                                <tr>
                                    <td>{t.timecard_date.slice(0, 10)}</td>
                                    <td>{t.job_id}</td>
                                    <td>{t.job_name}</td>

                                    <td>{t.reg_time}</td>
                                    <td>{t.overtime}</td>
                                    <td>$0</td>
                                    <td>{t.notes}</td>
                                    <td>{t.time_submitted}</td>

                                </tr>
                            )}

                        </tbody>

                    </Table>}

            </div>
        )
    


}

export default EmployeeDetail;