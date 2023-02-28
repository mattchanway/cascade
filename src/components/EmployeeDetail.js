import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useLocation, useParams, useNavigate, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import baseURL from '../helpers/constants';




function EmployeeDetail() {
    let { id } = useParams();
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [employee, setEmployee] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [timecardResults, setTimecardResults] = useState([]);


    useEffect(() => {

        async function getEmployee() {
            try {
                let res = await axios.get(`${baseURL}/employees/${id}`);
                console.log(res.data)
                setEmployee(res.data.userData);
                setTimecardResults(res.data.timecardsData)
                setIsLoading(false);
            }
            catch (e) {

                setIsUnauthorized(true);
            }
        }
        getEmployee();
    }, []);

    if (isUnauthorized === true) {

        return (
            <div>
                <h1>Bad request. Either the resource you requested does not exist, or you do not have permission to view this page</h1>
            </div>
        )

    }

    // if (isUnauthorized === false && isLoading === true) {

    //     return (
    //         <div>
    //             <h1>Loading!</h1>
    //         </div>
    //     )

    // }

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }


    if (isUnauthorized === false && isLoading === false) {

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
                                    <td>${t.expenses}</td>
                                    <td>{t.notes}</td>
                                    <td>{t.time_submitted}</td>

                                </tr>
                            )}

                        </tbody>

                    </Table>}

            </div>
        )
    }


}

export default EmployeeDetail;