import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import baseURL from '../helpers/constants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MyTimecardsReportResults from './MyTimecardsReportResults';
import Alert from 'react-bootstrap/Alert';



function MyTimecards() {

    const { employeeId, position, userNotFound } = useContext(UserContext);

    let INIT_STATE = {
        fromDate: '', toDate: ''
    };
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFromErrors] = useState([])
    const [timecardReportFormData, setTimecardReportFormData] = useState(INIT_STATE);
    const [timecardResults, setTimecardResults] = useState([]);


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
            <h1>My Timecards</h1>


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
                
                <Button variant="primary" type="submit" data-testid='myTimecardsReportSubmit'>Get Timecards</Button>

            </Form>
            {timecardResults && <MyTimecardsReportResults timecardResults={timecardResults}></MyTimecardsReportResults>}


        </div>

    )




}

export default MyTimecards;