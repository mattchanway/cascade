import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, useParams, Navigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import baseURL from '../helpers/constants';
import Unauthorized from './Unauthorized';

function EmployeeForm({ edit, employee_id ,first_name, last_name, email, empPosition, certification, start_date }) {

    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([])
    const BTN_VAL = edit === true ? "Edit Employee" : "Add New Employee";
    const navigate = useNavigate();
    
    const { employeeId, userNotFound, position } = useContext(UserContext);

    function validateEmail(mail){
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    return true
  }
    
    return false
}

    const INIT_STATE = edit !== true ? {
        first_name: '', last_name: '', email:'', empPosition: '',
        certification: '', start_date: ''
    } : {
        first_name, last_name, email, empPosition, certification, start_date
    }

    const [employeeFormData, setEmployeeFormData] = useState(INIT_STATE);
    const [certificationOptions, setCertificationOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    

    useEffect(() => {

        async function getPositionsAndCertifications() {
            try{
            let res = await axios.get(`${baseURL}/employees/params`);
           
            setCertificationOptions(res.data.certifications);
            setPositionOptions(res.data.positions);
            }
            
            catch(e){
             setServerError(true)
            }

        }
        getPositionsAndCertifications();

    }, []);


    async function processForm() {
        
        try {
            let { first_name, last_name, email, empPosition,
            certification, start_date} = employeeFormData;
            let position = empPosition;
            let res = !edit ? await axios.post(`${baseURL}/employees`, {
                first_name, last_name, email, position,
                certification, start_date
            }) : await axios.put(`${baseURL}/employees/${employee_id}`, {
                first_name, last_name, email, position,
            certification, start_date
            })
           
            navigate(`/employees`);
          
        }
        catch (e) {
            setServerError(true)
        }
    }

    function validateFormData(evt){

        evt.preventDefault();
        let errors = [];
        let validEmail = validateEmail(employeeFormData.email)
       

        if(employeeFormData.empPosition === '') errors.push('Select a position.')
        if(employeeFormData.certification === '') errors.push('Select a certification.')
        if(!validEmail) errors.push('Enter a valid email address.')
        if(errors.length){
            setFormErrors([...errors])

        }
        else{
            setFormErrors([])
            processForm()
        }

        


    }

    const handleChange = evt => {

        const { name, value } = evt.target;
        setEmployeeFormData(fData => ({
            ...fData,
            [name]: value
        }))
       
    }

 

    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    if(position !== 3) return <Navigate to="/unauthorized" replace={false}></Navigate>

   

    return (
        <div>
            <h1>{BTN_VAL}</h1>
            <Form onSubmit={validateFormData}>
            {formErrors && formErrors.map(err=><Alert key={err} variant='danger'>{err}</Alert>)}
                <Form.Group className="mb-3" controlId="first-name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        // disabled={edit === true ? true : false}
                        data-testid="first_name_test"
                        type="text"
                        name="first_name"
                        value={employeeFormData.first_name}
                        onChange={handleChange}
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="last-name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        data-testid="last_name_test"
                        name="last_name"
                        value={employeeFormData.last_name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        data-testid="email_test"
                        name="email"
                        value={employeeFormData.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        data-testid='posSelect'
                        as="select"
                        name="empPosition"
                        value={employeeFormData.empPosition}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={''}>Position</option>
                        {positionOptions && positionOptions.map(pos => <option key={`${pos.position_id}-posOption`} value={pos.position_id}>{pos.position_name}</option>)}
                    </Form.Control>

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        data-testid='certSelect'
                        as="select"
                        name="certification"
                        value={employeeFormData.certification}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={''}>Certification</option>
                        {certificationOptions && certificationOptions.map(c => <option key={`${c.certification_id}-certOption`} value={c.certification_id}>{c.certification_name}</option>)}
                    </Form.Control>

                </Form.Group>
                    <Form.Group className="mb-3" controlId="start-date-input">
                    <Form.Label>Start Date *must be YYYY-MM-DD*</Form.Label>
                    <Form.Control
                        onKeyDown={(e)=> {e.preventDefault()}}
                        data-testid='dateSelect'
                        name="start_date"
                        value={employeeFormData.start_date}
                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>

                <Button data-testid='emp-form-submit' variant="primary" type="submit">{BTN_VAL}</Button>
            </Form>

        </div>

    )





}

export default EmployeeForm;