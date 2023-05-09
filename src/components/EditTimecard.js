import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Table from 'react-bootstrap/Table';
import { useLocation, useParams, useNavigate, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import baseURL from '../helpers/constants';
import Unauthorized from './Unauthorized';
import Card from 'react-bootstrap/Card';
import EmployeeEditModal from './EmployeeEditModal';
import EmployeeStatusChangeModal from './EmployeeStatusChangeModal';




function EditTimecard() {

    const {position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        date: '', employeeId: ''
    };
    const [formData, setFormData] = useState(INIT_STATE)
    const [employeeDropdownData, setEmployeeDropdownData] = useState([])
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFromErrors] = useState([])
    const [timecardResults, setTimecardResults] = useState([])
    
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
                setEmployeeDropdownData(res.data)
            }
            catch (e) {
                setServerError(true);
            }
        }
        getEmployees();

    }, [])

    const handleChange = evt => {

        const { name, value } = evt.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleSubmit(evt){
        evt.preventDefault()

            try{
               
                let searchParams = {
                    date: formData.date,
                        employeeId: formData.employeeId

                }
                let res = await axios.get(`${baseURL}/timecards/indiv`, {
                    params: searchParams
                        
                    
                } )
                console.log(res)
                setTimecardResults(res.data);

            }
            catch(e){
                setServerError(true)
            }

    }



    if (serverError === true) return <Navigate to="/404" replace={false}></Navigate>

   

    if (position !== 3) {
       
        return <Navigate to="/unauthorized" replace={false}></Navigate>
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="from-date-input">
                    <Form.Label >From Date</Form.Label>
                    <Form.Control
                        required

                        name="date"
                        value={formData.fromDate}
                        onChange={handleChange}
                        onKeyDown={(e) => { e.preventDefault() }}
                        type="date"
                        autoFocus
                    />
                </Form.Group>


            <Form.Group className="mb-3" >
                    <Form.Label>Employee</Form.Label>
                    <Form.Control
                        as="select"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={''}>All Employees</option>
                        {employeeDropdownData && employeeDropdownData.map(emp => <option key={`empOption-${emp.employee_id}`} value={emp.employee_id}>{emp.first_name} {emp.last_name}</option>)}
                    </Form.Control>

                </Form.Group>
                <Button variant="primary" type="submit" data-testid='editTimecardSearchSubmit'>Search</Button>

            </Form>
            {!timecardResults.length === 0 ? 'h' : <Table responsive>
            <thead>
                            <tr>

                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Job Number</th>
                            
                                <th>Timecard Date</th>
                                <th>Reg Time</th>
                                <th>Overtime</th>
                                <th>Expenses</th>
                                


                            </tr>
                        </thead>
                        <tbody>
                            {timecardResults.map(t =>
                                <tr key={`${t.timecard_id}-row`}>
                                    <td key={`${t.timecard_id}-empIdCell`}>{t.employee_id}</td>
                                    <td key={`${t.timecard_id}-nameCell`}>{`${t.first_name} ${t.last_name}`}</td>
                                    <td key={`${t.timecard_id}-jobIdCell`}>{t.job_id}</td>
                                    
                                    <td key={`${t.timecard_id}-dateCell`}>{t.timecard_date.slice(0, 10)}</td>
                                    <td key={`${t.timecard_id}-regTimeCell`}>{t.reg_time}</td>
                                    <td key={`${t.timecard_id}-overtimeCell`}>{t.overtime}</td>
                                    <td key={`${t.timecard_id}-expensesCell`}>{'$'+t.expenses.toFixed(2)}</td>
                                    <td key={`${t.timecard_id}-buttonCell`}><Button>Edit</Button></td>
                                    

                                </tr>
                            )}

                        </tbody>
                
                </Table>}


        </div>


    )



}

export default EditTimecard