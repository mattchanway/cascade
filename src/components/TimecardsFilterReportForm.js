import React, { useContext, useState, useEffect } from 'react';
import { redirect, Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Login from './Login';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import baseURL from '../helpers/constants';
import TimecardsFilterReportResults from './TimecardsFilterReportResults';




function TimecardsFilterReportForm() {

    const { employeeId, position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        fromDate: '', toDate: '', employeeId: '', jobId: '', overtime: false
    };
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([])
    const [timecardReportFormData, setTimecardReportFormData] = useState(INIT_STATE);
    const [jobsDropdownData, setJobsDropdownData] = useState([]);
    const [employeeDropDownData, setEmployeeDropdownData] = useState([]);
    const [timecardResults, setTimecardResults] = useState([]);
    const [summaryResults, setSummaryResults] = useState({});

    useEffect(() => {

        async function getJobsAndEmployees() {
            try {
                let res = await axios.get(`${baseURL}/timecards/form-populate`);
             
                setJobsDropdownData(res.data.jobs);
                setEmployeeDropdownData(res.data.employees);
            }
            catch (e) {

                setServerError(true);
            }
        }
        getJobsAndEmployees();

    }, [])

    async function handleReportSubmit(evt) {
       
        evt.preventDefault();
        try {
            let dateA = new Date(timecardReportFormData.fromDate);
            let dateB = new Date(timecardReportFormData.toDate);
            if(dateA > dateB){
                setFormErrors([...formErrors, 'From date must not be greater than to date.'])
            }

            else{
            let { fromDate, toDate, employeeId, jobId, overtime } = timecardReportFormData;
            if (jobId.length === 0) jobId = null;
            if (employeeId.length === 0) employeeId = null;
            if (fromDate === '') fromDate = undefined;
            if (toDate === '') toDate = undefined;
            console.log(fromDate, toDate, employeeId, jobId, overtime)
            let res = await axios.get(`${baseURL}/timecards/filter`, {
                params: {
                    fromDate, toDate, employeeId, jobId, overtime
                }
            })
            setFormErrors([]);
            setSummaryResults(res.data.summary)
            setTimecardResults(res.data.table);
        }
        }
        catch (e) {
            setServerError(true);
        }
    }

    const handleChange = evt => {

        const { name, value } = evt.target;
        setTimecardReportFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }



    if (serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    if (position !== 3) {
       
        return <Navigate to="/unauthorized" replace={false}></Navigate>
    }

    return (
        <div>
            <h1>Employee Timecard Report</h1>


            <Form className='report' onSubmit={handleReportSubmit}>
            {formErrors && formErrors.map(err=><Alert variant='danger'>{err}</Alert>)}
                <Form.Group className="mb-3" controlId="from-date-input">
                    <Form.Label >From Date</Form.Label>
                    <Form.Control
                        required

                        name="fromDate"
                        value={timecardReportFormData.fromDate}
                        onChange={handleChange}
                        onKeyDown={(e) => { e.preventDefault() }}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="to-date-input">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                        required
                        name="toDate"
                        value={timecardReportFormData.toDate}
                        onKeyDown={(e) => { e.preventDefault() }}
                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Employee</Form.Label>
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
                <Form.Group className="mb-3">
                    <Form.Label>Job Site</Form.Label>
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

                <Button variant="primary" type="submit" data-testid='reportSubmit'>Search</Button>

            </Form>
            {timecardResults.length > 0 && <TimecardsFilterReportResults timecardResults={timecardResults} summaryResults={summaryResults}></TimecardsFilterReportResults>}


        </div>

    )





}

export default TimecardsFilterReportForm;