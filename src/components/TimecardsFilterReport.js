import React, { useContext, useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TimecardsFilterReportForm from './TimecardsFilterReportForm';
import TimecardPreview from './TimecardPreview';
import Login from './Login';



function TimecardsFilterReport() {

    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [timecardResults, setTimecardResults] = useState([]);

    function populatePage(data) {
        setTimecardResults(data);

    }

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
     }

    return (
        <div>
            <TimecardsFilterReportForm populatePage={populatePage} ></TimecardsFilterReportForm>
            {timecardResults.length >0 &&
                <Table hover ={true} className='table' responsive>
                    <thead>
                        <tr>
                            
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Job Number</th>
                            <th>Job Name</th>
                            <th>Timecard Date</th>
                            <th>Reg Time</th>
                            <th>Overtime</th>
                            <th>Expenses</th>
                            <th>Notes</th>
                            
                           
                        </tr>
                    </thead>
                    <tbody>
                        {timecardResults.map(t =>
                            <tr>
                                <td>{t.employee_id}</td>
                                <td>{`${t.first_name} ${t.last_name}`}</td>
                                <td>{t.job_id}</td>
                                <td>{t.job_name}</td>
                                <td>{t.timecard_date.slice(0, 10)}</td>
                                <td>{t.reg_time}</td>
                                <td>{t.overtime}</td>
                                <td>${t.expenses}</td>
                                <td>{t.notes}</td>
                               
                              
                            </tr>
                        )}

                    </tbody>

                </Table>
            }


        </div>

    )

    {
        timecardResults && timecardResults.map(t => <TimecardPreview timecard_id={t.timecard_id}
            job_id={t.job_id} employee_id={t.employee_id} timecard_date={t.timecard_date}
            reg_time={t.reg_time} overtime={t.overtime} notes={t.notes} expenses={t.expenses} time_submitted={t.time_submitted}
            location_submitted={t.location_submitted} ></TimecardPreview>)
    }



}

export default TimecardsFilterReport;