import React, { useContext, useState } from 'react';
import UserContext from './UserContext';
import { Navigate, Link } from "react-router-dom";
import TimecardsFilterReportForm from './TimecardsFilterReportForm';
import SummaryReport from './SummaryReport';

function ReportsList(){

    const { position } = useContext(UserContext);


    return position !== 3 ? <Navigate to="/404" replace={false}></Navigate> :(
        <div>
            <h2>Reports</h2>
            <Link to='/reports/employee-timecard'>Employee Timecard Report</Link><br></br>
            <Link to='/reports/job-summary'>Job Summary Report</Link>
        </div>
    )

}


export default ReportsList