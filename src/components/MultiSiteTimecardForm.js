import { React, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import toISOLocal from '../helpers/toISOLocal';
import axios from 'axios';
import CurrencyInput from 'react-currency-input-field';
import baseURL from '../helpers/constants';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function MultiSiteTimecardForm() {
    axios.defaults.withCredentials = true;
    const date = new Date();
    let isoStr = toISOLocal(date);
    let iso = isoStr.slice(0, 10)
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    const [nextRowId, setNextRowId] = useState(3);

    const [timecardDate, setTimecardDate] = useState(iso);
    const [rows, setRows] = useState([{ rowId: 1, job_id: '', reg_time: '', overtime: '', expenses: '', notes: '' },
    { rowId: 2, job_id: '', reg_time: '', overtime: '', expenses: '', notes: '' }])
    const [jobs, setJobs] = useState([]);

    let errors = {
        1: "Please enter a valid date.",
        2: "Regular time must be at least 1, and no more than 8.",
        3: "Overtime cannot be a negative number.",
        4: "Expenses must be blank, or a positive number",
        5: "Notes must be 150 characters or less."
    }



    useEffect(() => {

        async function getJobs() {

            try {

                let res = await axios.get(`${baseURL}/jobs`, { withCredentials: true });
                let newJobs = res.data.noUser ? [] : res.data;
                setJobs(newJobs);
            }

            catch (e) {
                setServerError(true);
            }
        }
        getJobs();

    }, [])


    async function handleTimecardSubmit(evt) {

        //     try {
        //         let job_id = job.job_id;
        //         let employee_id = employeeId
        //         let { timecard_date, reg_time, overtime, expenses, notes } = timecardFormData;
        //         let res = await axios.post(`${baseURL}/timecards/`, {
        //             job_id, employee_id, timecard_date, reg_time, overtime, expenses, notes
        //         })

        //         setFormErrors([])
        //         setTimecardFormData(INIT_STATE);
        //         // handleShowToast();

        //     }
        //     catch (e) {
        //         setServerError(true);
        //     }

    }

    const handleNewRow = () => {

        if (nextRowId > 12) {
            setFormErrors([...formErrors, 'Maximum 12 timecards for one daily entry.'])
        }
        else {
            setRows([...rows, { rowId: nextRowId, job_id: '', reg_time: '', overtime: '', expenses: '', notes: '' }])
            setNextRowId(rowId => rowId + 1);
        }

    }


    const handleChange = (id, evt) => {

        let { name, value } = evt.target;



        if (name === 'timecard_date') {
            setTimecardDate(value);
        }
        else {

            let editRowInd = rows.findIndex(r => r.rowId === id);
            let editRow = rows[editRowInd];
            editRow = { ...editRow, [name]: value }
            setRows([...rows.slice(0, editRowInd), editRow, ...rows.slice(editRowInd + 1)])
            console.log(rows)

        }
    }

    function validateFormData(evt) {
        evt.preventDefault();
        let errors = [];
        let set = new Set();
        if (typeof Date.parse(timecardDate) === NaN) set.add(1);

        rows.forEach(r => {

            if (r.reg_time < 1 || r.reg_time > 8) set.add(2);
            if (r.overtime < 0) set.add(3)
            if (r.expenses.length > 0 && isNaN(+r.expenses) === true) set.add(4);
            if (r.notes.length > 150) set.add(5);
        })

        if (set.size === 0) handleTimecardSubmit(evt);
        else {

            setFormErrors()

        }





        if (errors.length) {

            setFormErrors([...errors]);
        }
        else {

            handleTimecardSubmit(evt);
        }
    }


    // if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div className='job-list-container'>
            <Form onSubmit={validateFormData} className='multi-form'>
                {formErrors && formErrors.map(e => <Alert variant="danger">{e}</Alert>)}
                <Form.Group className="mb-3" controlId="dateInput">
                    <Form.Label>Date *must be YYYY-MM-DD*</Form.Label>
                    <Form.Control

                        name="timecard_date"
                        value={timecardDate}
                        onKeyDown={(e) => { e.preventDefault() }}
                        onChange={(evt) => handleChange(null, evt)}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
                <Container>


                </Container>
                {rows.map((r, i) => <Row>
                    <Col >
                        <Form.Group>
                            <Form.Label>Job Site</Form.Label>
                            <Form.Control
                                key={`jobId-${r.rowId}`}
                                as="select"
                                name="job_id"
                                value={r.job_id}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            >

                                {jobs && jobs.map(job => <option value={job.job_id}>{job.job_id} - {job.job_name}</option>)}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="regTimeInput" >
                            <Form.Label>Reg Time</Form.Label>
                            <Form.Control
                                key={`regTime-${r.rowId}`}
                                data-testid="regTimeInput"
                                type="number"
                                name="reg_time"
                                value={r.reg_time}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                                autoFocus
                            />
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="overtimeInput" >
                            <Form.Label>Overtime</Form.Label>
                            <Form.Control
                                key={`overtime-${r.rowId}`}
                                data-testid="overtimeInput"
                                type="number"
                                name="overtime"
                                value={r.overtime}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            />
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="expensesInput" >
                            <Form.Label>Expenses</Form.Label>
                            <Form.Control
                                key={`expenses-${r.rowId}`}
                                type="number"
                                data-testid="expensesInput"
                                name="expenses"
                                value={r.expenses}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            />
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="notesInput" >
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                key={`notesInput-${r.rowId}`}
                                as="textarea"
                                data-testid="notesInput"
                                rows={1}
                                name="notes"
                                maxLength={150}
                                value={r.notes}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            />
                        </Form.Group>
                    </Col>


                </Row>)}


                <Button onClick={handleNewRow} type="button">Add Jobsite</Button>
                <Button variant="primary" type="submit" data-testid="submitTimecardButton">Submit Timecard</Button>
            </Form>
        </div>


    )




}

export default MultiSiteTimecardForm;