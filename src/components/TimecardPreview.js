import React, { useContext } from 'react';
import UserContext from './UserContext';




function TimecardPreview({ timecard_id, job_id, employee_id, timecard_date, reg_time, overtime,
    notes, expenses, time_submitted, location_submitted }) {

        const { employeeId, position, userNotFound } = useContext(UserContext);



    return (
        <div>
            <h1>timecard</h1>
            <p>{job_id}, {employee_id}, {reg_time}, {expenses}</p>

        </div>

    )





}

export default TimecardPreview;