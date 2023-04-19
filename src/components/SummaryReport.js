import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import baseURL from '../helpers/constants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SummaryReportResults from './SummaryReportResults'
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';







function SummaryReport() {

    const { employeeId, position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        fromDate: '', toDate: ''
    };
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFromErrors] = useState([])
    const [timecardReportFormData, setTimecardReportFormData] = useState(INIT_STATE);
    const [summaryReportResults, setSummaryReportResults] = useState([]);
    const [employeeBooleanArray, setEmployeeBooleanArray] = useState([])
    const [showModal, setShowModal] = useState(false)

    let handleCloseEmployeeCheckbox = () => setShowModal(false)
    let handleOpenEmployeeCheckbox = () => setShowModal(true)

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


    async function handleReportSubmit(e) {
        e.preventDefault()
        
        try {
            let searchParams = new URLSearchParams();
            searchParams.append("fromDate", timecardReportFormData.fromDate)
            searchParams.append("toDate", timecardReportFormData.toDate)
            let excludedEmployees = employeeBooleanArray.filter((emp) => emp.included===false).map(obj=>obj.employee_id)
            excludedEmployees.forEach(id=>searchParams.append("excludedEmployees", id))
            let res = await axios.get(`${baseURL}/timecards/reports/job-summary`, {
                params: searchParams
            })
           console.log(res.data)
            setSummaryReportResults(res.data)
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

    function onCheckClick(evt){
        const {checked, name} = evt.target
        let newArr = employeeBooleanArray.map((emp)=> emp.employee_id === +name ? {...emp, included: checked} : emp)
        setEmployeeBooleanArray(newArr)
       
       }
    
    if (serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }


    return (
        <div>
            <h1>Summary Report</h1>


            <Form className='report' onSubmit={handleReportSubmit}>
                <p>**The For Employees dropdown shows the employees whose timecards will be included in the total - all employees selected by default.</p>
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
              
                {employeeBooleanArray && <Dropdown>
      <Dropdown.Toggle drop={'down'} variant="primary" id="dropdown-checkbox">
        For Employees
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'scroll' }} >
      {employeeBooleanArray.map((emp => <Form.Check  key={`exclude-sel-${emp.employee_id}`} defaultChecked={true} name={emp.employee_id} onChange={onCheckClick} type='checkbox' label={`${emp.first_name} ${emp.last_name}`}></Form.Check>))}
      </Dropdown.Menu>
    </Dropdown>}<br></br>
                
                <Button variant="primary" type="submit" data-testid='myTimecardsReportSubmit'>Get Timecards</Button>
               
            </Form>

            {summaryReportResults && <SummaryReportResults results = {summaryReportResults}></SummaryReportResults> }
            

        </div>

    )




}

export default SummaryReport;