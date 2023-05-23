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
import DeleteTimecardRow from './DeleteTimecardRow';




function DeleteTimecard() {

    const {position } = useContext(UserContext);

    let INIT_STATE = {
        date: '', employeeId: ''
    };
    const [formData, setFormData] = useState(INIT_STATE)
    const [employeeDropdownData, setEmployeeDropdownData] = useState([])
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFromErrors] = useState([])
    const [timecardResults, setTimecardResults] = useState([])
    

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
             
                setTimecardResults(res.data);

            }
            catch(e){
                setServerError(true)
            }

    }

    async function handleDelete(timecardId){
        

        try{
            let res = await axios.delete(`${baseURL}/timecards/${timecardId}`)
            let newResults = timecardResults.filter(t=>t.timecard_id !== timecardId)
            setTimecardResults(newResults)
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
           <Table responsive>
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
                                <DeleteTimecardRow t={t} handleDelete={handleDelete}></DeleteTimecardRow>
                            )}

                        </tbody>
                
                </Table>


        </div>


    )



}

export default DeleteTimecard