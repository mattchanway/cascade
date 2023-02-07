
import {React, useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import toISOLocal from '../helpers/toISOLocal';
import axios from 'axios';
import CurrencyInput from 'react-currency-input-field';
import baseURL from '../helpers/constants';

function AddTimecardForm({showForm, handleClose, job, employeeId, handleShowToast }) {

    const [formErrors, setFormErrors] = useState([]);
    const date = new Date();
    let isoStr = toISOLocal(date);
    let iso = isoStr.slice(0,10)

    let INIT_STATE = {
        timecard_date: iso, reg_time: '', overtime: '', expenses: '', notes: ''
    };

    const [timecardFormData, setTimecardFormData] = useState(INIT_STATE);

    async function handleTimecardSubmit(evt) {

        try {
            let job_id = job.job_id;
            let employee_id = employeeId
            let { timecard_date, reg_time, overtime, expenses, notes } = timecardFormData;
            let res = await axios.post(`${baseURL}/timecards/`, {
                job_id, employee_id, timecard_date, reg_time, overtime, expenses, notes
            })
            setTimecardFormData(INIT_STATE);
            handleShowToast();
            handleClose();
            
        }
        catch (e) {
            console.log(e);
        }

    }

    const handleChange = evt => {
        const { name, value } = evt.target;
        setTimecardFormData(fData => ({
            ...fData,
            [name]: value
        }))

    }

    function validateFormData(evt) {
        evt.preventDefault();
        let { timecard_date, reg_time, overtime, expenses } = timecardFormData;
        let errors = [];
        if (typeof Date.parse(timecard_date) === NaN) errors.push("Please enter a valid date.")
        if (reg_time < 1 || reg_time > 8) errors.push("Regular time must be at least 1, and no more than 8.");
        if (overtime < 0) errors.push("Overtime cannot be a negative number.");
        if (expenses.length > 0 && isNaN(+expenses) === true) errors.push("Expenses must be blank, or a number(example: 7.50)");

        if (errors.length) {
            setFormErrors([...errors]);
        }
        else {

            handleTimecardSubmit(evt);
        }
    }
   

    return(
        <Modal show={showForm} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>New Timecard: {job && job.job_name} {job && job.job_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={validateFormData}>
                        {formErrors && formErrors.map(e => <Alert variant="danger">{e}</Alert>)}
                        <Form.Group className="mb-3" controlId="dateInput">
                            <Form.Label>Date *must be YYYY-MM-DD*</Form.Label>
                            <Form.Control

                                name="timecard_date"
                                value={timecardFormData.timecard_date}

                                onChange={handleChange}
                                type="date"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regTimeInput">
                            <Form.Label>Reg Time</Form.Label>
                            <Form.Control
                                type="number"
                                name="reg_time"
                                value={timecardFormData.reg_time}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="overtimeInput">
                            <Form.Label>Overtime</Form.Label>
                            <Form.Control
                                type="number"
                                name="overtime"
                                value={timecardFormData.overtime}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="expensesInput">
                            <Form.Label>Expenses</Form.Label>
                            <Form.Control
                                prefix="$"
                               
                                name="expenses"
                                value={timecardFormData.expenses}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="notesInput">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                maxLength = {150}
                                value={timecardFormData.notes}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit Timecard</Button>
                    </Form>

                </Modal.Body>
                

            </Modal>
    )




}

export default AddTimecardForm;

