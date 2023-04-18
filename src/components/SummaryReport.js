import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import baseURL from '../helpers/constants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MyTimecardsReportResults from './MyTimecardsReportResults';
import Alert from 'react-bootstrap/Alert';



function SummaryReport() {

    const { employeeId, position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        fromDate: '', toDate: ''
    };
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFromErrors] = useState([])
    const [timecardReportFormData, setTimecardReportFormData] = useState(INIT_STATE);
    const [timecardResults, setTimecardResults] = useState([]);
    // const [excludedEmployees, setExcludedEmployees] = useState([])
    const [employeeBooleanArray, setEmployeeBooleanArray] = useState([])

    // THE INTERFACE IS A BOOLEAN CHECKBOX DROPDOWN WITH EVERY CHECKBOX INITIALIZED TO TRUE
    // USE EFFECT TO GET ALL THE EMPLOYEES, NEED THEIR NAME AND ID
    // KEPT AS STATE / FORM DATA, ALL INITIALIZED TO TRUE
    // IF UNCHECKED, THAT ID IS ADDED TO EXCLUDED EMPLOYEES OR VICE VERSA

    useEffect(() => {

        async function getEmployees() {
            try {
                let res = await axios.get(`${baseURL}/employees`);
                let arr = res.data.map(emp=> ({employee_id: emp.employee_id, first_name: emp.first_name, last_name:emp.last_name, included:true}))
             
                setEmployeeBooleanArray(arr);
            }
            catch (e) {

                setServerError(true);
            }
        }
        getEmployees();

    }, [])


    async function handleReportSubmit(fromDate, toDate) {
       
        
        try {
            let res = await axios.get(`${baseURL}/timecards/filter`, {
                params: {
                    fromDate: fromDate, toDate: toDate, employeeId: employeeId, jobId: null, overtime: null
                }
            })
           
            setTimecardResults(res.data.table)
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

    function validateForm(evt){
        evt.preventDefault();

        let { fromDate, toDate} = timecardReportFormData;
        let dateA = new Date(fromDate);
        let dateB = new Date(toDate);

        if(dateA > dateB){
            setFromErrors([...formErrors, 'From date cannot be greater than to date.'])
        }
        else{
            setFromErrors([]);
            handleReportSubmit(fromDate, toDate)
        }
      

    }



    if (serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    

    return (
        <div>
            <h1>Summary Report</h1>


            <Form className='report' onSubmit={validateForm}>
            {formErrors && formErrors.map(err=><Alert key={err} variant='danger'>{err}</Alert>)}
                <Form.Group className="mb-3" controlId="from-date-input">
                    <Form.Label >From Date</Form.Label>
                    <Form.Control
                        required
                        data-testid='myTimecardsFromDate'
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
                        data-testid='myTimecardsToDate'
                        value={timecardReportFormData.toDate}
                        onKeyDown={(e) => { e.preventDefault() }}
                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Employees</Form.Label>
                <Form.Control 
                
                
                
                />

                </Form.Group>
                
                <Button variant="primary" type="submit" data-testid='myTimecardsReportSubmit'>Get Timecards</Button>

            </Form>
            {/* RENDER RESULTS HERE */}
            {/* {timecardResults && <MyTimecardsReportResults timecardResults={timecardResults}></MyTimecardsReportResults>} */}


        </div>

    )




}

export default SummaryReport;