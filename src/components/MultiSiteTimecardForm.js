import { React, useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
import errors from '../helpers/constants'

function MultiSiteTimecardForm() {
    axios.defaults.withCredentials = true;
    const date = new Date();
    const navigate = useNavigate()
    let isoStr = toISOLocal(date);
    let iso = isoStr.slice(0, 10)
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    const [nextRowId, setNextRowId] = useState(3);

    const [timecardDate, setTimecardDate] = useState(iso);

    const [rows, setRows] = useState([{ rowId: 1, job_id: '', reg_time: 0, overtime: 0, expenses: 0, notes: '' },
    { rowId: 2, job_id: '', reg_time: 0, overtime: 0, expenses: 0, notes: ''}])
    const [jobs, setJobs] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => setShowToast(false);
    const handleShowToast = () => setShowToast(true);

    


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

            try {
                let submit = [];
                rows.forEach((r,i)=> {submit[i] = 
                    {...r, timecard_date:timecardDate, employee_id:employeeId}
                if(submit[i].overtime ==='') submit[i].overtime = 0;
                if(submit[i].expenses ==='') submit[i].expenses = 0;
                })
          
                
                let res = await axios.post(`${baseURL}/timecards/multi`, {
                rows: submit})
                    console.log(res.data)
                setFormErrors([])
                setRows([{ rowId: 1, job_id: '', reg_time: 0, overtime: 0, expenses: 0, notes: '' },
                { rowId: 2, job_id: '', reg_time: 0, overtime: 0, expenses: 0, notes: ''}])

                handleShowToast();
                setNextRowId(3);
                setFormErrors([])
            }
            catch (e) {
                setServerError(true);
            }

    }

    const handleNewRow = () => {

        if (rows.length > 12) {
            setFormErrors([...formErrors, 'Maximum 12 timecards for one daily entry.'])
        }
        else {
            setRows([...rows, { rowId: nextRowId, job_id: '', reg_time: 0, overtime: 0, expenses: 0, notes: ''}])
            setNextRowId(rowId => rowId + 1);
        }

    }

    const handleRowDelete = (id, evt) => {

        setRows(rows.filter(r=> r.rowId !== id))

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
            

        }
    }

    function validateFormData(evt) {
        evt.preventDefault();
      
        let set = new Set();
        if (typeof Date.parse(timecardDate) === NaN) set.add(1);

        rows.forEach(r => {
            if (r.reg_time !== '' && r.reg_time < 0.5 || r.reg_time > 8) set.add(2);
            if (r.overtime && r.overtime < 0) set.add(3)
            if (r.expenses.length > 0 && isNaN(+r.expenses) === true) set.add(4);
            if (r.notes.length > 150) set.add(5);
            if (r.job_id === '')set.add(6)
            if(r.reg_time ==='')set.add(7)
        })
        if (set.size === 0) handleTimecardSubmit(evt);
        else {
            const errors = {
                1: "Please enter a valid date.",
                2: "Regular time must be at least 0.5, and no more than 8.",
                3: "Overtime cannot be a negative number.",
                4: "Expenses must be blank, or a positive number",
                5: "Notes must be 150 characters or less.",
                6: "Ensure you have selected a job site for all timecards.",
                7: "Reg time cannot be blank."
            }
            
            setFormErrors([...set].map(code=> errors[code]));
          
        }

    }

    console.log(rows)
    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div className='multi-form'>
             <Toast onClose={handleCloseToast} show={showToast} delay={5000} autohide>
      <Toast.Body>Timecard added!</Toast.Body>
    </Toast>
            <Form onSubmit={validateFormData}>
                {formErrors && formErrors.map(e => <Alert variant="danger">{e}</Alert>)}
                <Form.Group className="mb-3" controlId="dateInput">
                    <Form.Label>Date</Form.Label>
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
                    <Col xs={12}  >
                        <Form.Group>
                            <Form.Label>Job Site</Form.Label>
                            <Form.Control
                                key={`jobId-${r.rowId}`}
                                as="select"
                                data-testid={`jobSite-${r.rowId}`}
                                name="job_id"
                                value={r.job_id}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            >
                                <option value=''>Select Job</option>
                                {jobs && jobs.map(job => <option data-testid={`jobOption-${r.rowId}-${job.job_id}`} value={job.job_id}>{job.job_id} - {job.job_name}</option>)}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={6} m={4} >
                        <Form.Group className="mb-3" controlId="regTimeInput" >
                            <Form.Label>Reg Time</Form.Label>
                            <Form.Control
                                key={`regTime-${r.rowId}`}
                                data-testid={`regTimeInput-${r.rowId}`}
                                type="number"
                                name="reg_time"
                                value={r.reg_time}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                                autoFocus
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6} m={4}>
                        <Form.Group className="mb-3" controlId="overtimeInput" >
                            <Form.Label>Overtime</Form.Label>
                            <Form.Control
                                key={`overtime-${r.rowId}`}
                                data-testid={`overtimeInput-${r.rowId}`}
                                type="number"
                                name="overtime"
                                value={r.overtime}
                                onChange={(evt) => handleChange(r.rowId, evt)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} m={4} >
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
                    <Col xs = {12} m={4} >
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
                    <Col xs={12}>
                    <Button variant="danger" onClick={(evt) =>handleRowDelete(r.rowId, evt)}>X</Button>
                    </Col>

                </Row>)}


                <Button onClick={handleNewRow} type="button" data-testid="AddMultiTimecardButton">Add Jobsite</Button>
                <Button variant="primary" type="submit" data-testid="submitMultiTimecardButton">Submit Timecard</Button>
            </Form>

        </div>


    )




}

export default MultiSiteTimecardForm;