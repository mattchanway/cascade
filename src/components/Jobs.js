// import '../css/App.css';
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import UserContext from './UserContext';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import BadgeIcon from '@mui/icons-material/Badge';
import baseURL from '../helpers/constants';


function Jobs({ setLoggedInUser }) {
    const location = useLocation();
    const flash = location.state && location.state.message === 'success' ? true : false;
    const [jobs, setJobs] = useState([]);
    const { employeeId, userNotFound, firstName, lastName, firstLogin } = useContext(UserContext);
    const [jobAddedAlert, setJobAddedAlert] = useState(flash);
    axios.defaults.withCredentials = true;
    useEffect(() => {

        async function getJobs() {
            
            let res = await axios.get(`${baseURL}/jobs`, { withCredentials: true });
            let newJobs = res.data.noUser ? [] : res.data;
            setJobs(newJobs);
        }
        getJobs();

    }, [])

    function closeSuccessAlert() {
        setJobAddedAlert(false);
        window.history.replaceState({}, document.title)

    }


    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    if (employeeId  && firstLogin === true) {
        return <Navigate to="/admin/password" replace={true}></Navigate>
     }

    return (
        <div className='job-list-container'>
            <div className='jobs-heading-container'>
                <div className='jobs-heading-div'>
                <h1 className='jobs-heading'>Select A Job To Get Started.</h1>
                </div>
            </div>
           
           
            {jobs && <ListGroup as="ul" className="job-list">

                {jobs.map((j) => <ListGroup.Item className='jobs-listgroup' action href={`/jobs/${j.job_id}`}>
                    <Container>
                        <Row className="align-items-center">
                        <Col className='badge-col' xs={2}><BadgeIcon fontSize='medium' className='jobs-arrowcircle'></BadgeIcon></Col>
                    <Col xs={8}>{j.job_id} - {j.job_name} <br></br>
                    {`${j.job_address_street_line1} ${j.job_address_street_unit ? j.job_address_street_unit : ''} ${j.job_address_street_city}`}</Col>
                    <Col xs={2}><ArrowCircleRightIcon fontSize='medium' className='jobs-arrowcircle'></ArrowCircleRightIcon></Col>
                    </Row>
                    </Container>
                    </ListGroup.Item>)}
            </ListGroup>}
            {jobAddedAlert && <Alert variant={'success'} dismissible onClose={closeSuccessAlert} >Timecard added!</Alert>}

        </div>

    )
}

export default Jobs;