import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TimecardsFilterReportForm from './TimecardsFilterReportForm';
import TimecardPreview from './MyTimecards';
import Login from './Login';



function TimecardsFilterReportResults({timecardResults, summaryResults}) {

  
    

    return (
        <div>
                <div className='report-table-wrapper'>
                    <Table hover={true} className='table' responsive>
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
                                    <td>{'$'+t.expenses.toFixed(2)}</td>
                                    <td>{t.notes}</td>


                                </tr>
                            )}

                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>Regular Hours</b></td>
                                <td><b>Overtime Hours</b></td>
                                <td><b>Expenses</b></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>Totals</b></td>
                                <td>{summaryResults.totalReg}</td>
                                <td>{summaryResults.totalOT}</td>
                                <td>{'$'+summaryResults.totalExp.toFixed(2)}</td>
                                <td></td>
                            </tr>

                        </tfoot>

                    </Table>
                   
                </div>
    
        
        </div>

    )




}

export default TimecardsFilterReportResults;