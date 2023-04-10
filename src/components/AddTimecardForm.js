
import {React, useState} from 'react';
import {Navigate} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import toISOLocal from '../helpers/toISOLocal';
import axios from 'axios';
import baseURL from '../helpers/constants';

function AddTimecardForm({showForm, handleClose, job, employeeId, handleShowToast, handleErrorShow }) {
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    const date = new Date();
    let isoStr = toISOLocal(date);
    let iso = isoStr.slice(0,10)

    let INIT_STATE = {
        timecard_date: iso, reg_time: '', overtime: 0, expenses: 0, notes: ''
    };

    const [timecardFormData, setTimecardFormData] = useState(INIT_STATE);

    async function handleTimecardSubmit(evt) {


        try {
            let job_id = job.job_id;
            let employee_id = employeeId
            let { timecard_date, reg_time, overtime, expenses, notes } = timecardFormData;
            if(!overtime) overtime = 0;
            if(!expenses) expenses = 0
            let res = await axios.post(`${baseURL}/timecards/`, {
                job_id, employee_id, timecard_date, reg_time, overtime, expenses, notes
            })
           
            setFormErrors([])
            setTimecardFormData(INIT_STATE);
            handleShowToast();
            handleClose();
            
        }
        catch (e) {
            // setServerError(true);
            handleErrorShow(true)
            handleClose()
        }

    }

    const handleChange = evt => {
        
        let { name, value } = evt.target;
    
        setTimecardFormData(fData => ({
            ...fData,
            [name]: value
        }))
       
       

    }

    function validateFormData(evt) {
        evt.preventDefault();
        let { timecard_date, reg_time, overtime, expenses, notes } = timecardFormData;
        let errors = [];
        if (isNaN(timecard_date)) errors.push("Please enter a valid date.")
        if(!reg_time.length) errors.push('Regular time cannot be blank.')
        if (reg_time.length && reg_time < 1 || reg_time.length && reg_time > 8) errors.push("Regular time must be at least 1, and no more than 8.");
        if (overtime < 0) errors.push("Overtime cannot be a negative number.");
        if (expenses.length > 0 && isNaN(+expenses) === true) errors.push("Expenses must be blank, or a number(example: 7.50)");
        if (notes.length > 200) errors.push("Notes must be 200 characters or less.")

        if (errors.length) {
         
            setFormErrors([...errors]);
        }
        else {

            handleTimecardSubmit(evt);
        }
    }
   

    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return(
        <Modal show={showForm} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>New Timecard: {job && job.job_name} {job && job.job_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={validateFormData}>
                        {formErrors && formErrors.map(e => <Alert key={e} variant="danger">{e}</Alert>)}
                        <Form.Group className="mb-3" controlId="dateInput">
                            <Form.Label>Date *must be YYYY-MM-DD*</Form.Label>
                            <Form.Control

                                name="timecard_date"
                                value={timecardFormData.timecard_date}
                                onKeyDown={(e)=> {e.preventDefault()}}
                                onChange={handleChange}
                                type="date"
                                
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regTimeInput" >
                            <Form.Label>Reg Time</Form.Label>
                            <Form.Control
                              
                                data-testid="regTimeInput"
                                type="number"
                                name="reg_time"
                                value={timecardFormData.reg_time}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="overtimeInput" >
                            <Form.Label>Overtime</Form.Label>
                            <Form.Control
                             
                                data-testid="overtimeInput"
                                type="number"
                                name="overtime"
                                value={timecardFormData.overtime}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="expensesInput" >
                            <Form.Label>Expenses</Form.Label>
                            <Form.Control
                            
                                type="number"
                                data-testid="expensesInput"
                                name="expenses"
                                value={timecardFormData.expenses}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="notesInput" >
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                data-testid="notesInput"
                                rows={3}
                                name="notes"
                                maxLength = {150}
                                value={timecardFormData.notes}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" data-testid="submitTimecardButton">Submit Timecard</Button>
                    </Form>

                </Modal.Body>
                

            </Modal>
    )




}

export default AddTimecardForm;

