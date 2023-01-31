import React, { useContext, useState, useEffect } from 'react';
import {redirect} from 'react-router-dom';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Login from './Login';




function TimecardsFilterReportForm({populatePage}) {
 
    const { employeeId, position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        fromDate: '', toDate: '', employeeId: '', jobId: '', overtime: false
    };

    const [timecardReportFormData, setTimecardReportFormData] = useState(INIT_STATE);
    const [jobsDropdownData, setJobsDropdownData] = useState([]);
    const [employeeDropDownData, setEmployeeDropdownData] = useState([]);


    useEffect(() => {

        async function getJobsAndEmployees() {
            let res = await axios.get(`/timecards/form-populate`);

            setJobsDropdownData(res.data.jobs);
            setEmployeeDropdownData(res.data.employees);
        }
        getJobsAndEmployees();

    }, [])

    async function handleReportSubmit(evt) {
        evt.preventDefault();
        try {
           
            let { fromDate, toDate, employeeId, jobId, overtime } = timecardReportFormData;
            if (jobId.length === 0) jobId = null;
            if (employeeId.length === 0) employeeId = null;
            if (fromDate === '') fromDate = undefined;
            if (toDate === '') toDate = undefined;
           
            let res = await axios.get(`/timecards/filter`, {
                params: {
                    fromDate, toDate, employeeId, jobId, overtime
                }
            })
            console.log(res.data)
            populatePage(res.data)
        }
        catch (e) {
            console.log(e);
        }

    }

    const handleChange = evt => {
     
        const { name, value } = evt.target;
        setTimecardReportFormData(fData => ({
            ...fData,
            [name]: value
        }))
        console.log(timecardReportFormData)
        


    }





    return (
        <div>

            <Form onSubmit={handleReportSubmit}>
                <Form.Group className="mb-3" controlId="from-date-input">
                    <Form.Label>Date *must be YYYY-MM-DD*</Form.Label>
                    <Form.Control

                        name="fromDate"
                        value={timecardReportFormData.fromDate}
                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="to-date-input">
                    <Form.Label>Date *must be YYYY-MM-DD*</Form.Label>
                    <Form.Control

                        name="toDate"
                        value={timecardReportFormData.toDate}

                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Form.Group >
                    <Form.Control
                        as="select"
                        name="employeeId"
                        value={timecardReportFormData.employeeId}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={''}>All Employees</option>
                        {employeeDropDownData && employeeDropDownData.map(emp => <option value={emp.employee_id}>{emp.first_name} {emp.last_name}</option>)}
                    </Form.Control>

                </Form.Group>
                <Form.Group>
                    <Form.Control
                        as="select"
                        name="jobId"
                        value={timecardReportFormData.jobId}
                        onChange={handleChange}
                    >
                        <option value={''}>All Jobs</option>
                        {jobsDropdownData && jobsDropdownData.map(job => <option value={job.job_id}>{job.job_id} - {job.job_name}</option>)}
                    </Form.Control>

                </Form.Group>
                {/* <Form.Group >
                    <Form.Check
                        name="overtime"
                        onChange={handleChange}
                        value={timecardReportFormData.overtime}
                        label="Show Overtime Timecards Only">
                    </Form.Check>
                </Form.Group> */}
                <Button variant="primary" type="submit">Search</Button>

            </Form>


        </div>

    )





}

export default TimecardsFilterReportForm;