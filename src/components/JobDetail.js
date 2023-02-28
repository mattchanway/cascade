// import '../css/App.css';
import React, { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useLocation, useParams, useNavigate, redirect, Navigate } from "react-router-dom";
import axios from "axios";
import UserContext from './UserContext';
import Card from 'react-bootstrap/Card';
import InactiveWarning from './InactiveWarning';
import JobEditModal from './JobEditModal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import AddTimecardForm from './AddTimecardForm';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import baseURL from '../helpers/constants';

function JobDetail({ }) {
    

    const [showForm, setShowForm] = useState(false);
    const [showInvalidAlert, setShowInvalidAlert] = useState(false);
    const handleClose = () => setShowForm(false);
    const handleShow = () => setShowForm(true);
    const [job, setJob] = useState(null);
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => setShowToast(false);
    const handleShowToast = () => setShowToast(true);
    const [showInactiveWarning, setShowInactiveWarning] = useState(false);
    const handleCloseInactiveWarning = () => setShowInactiveWarning(false);
    const handleShowInactiveWarning = () => setShowInactiveWarning(true);
    const [showJobEdit, setShowJobEdit] = useState(false);
    const handleCloseJobEdit = () => setShowJobEdit(false);
    const handleShowJobEdit = () => setShowJobEdit(true);

    const { id } = useParams();
   

    useEffect(() => {

        async function getJob() {
            let res = await axios.get(`${baseURL}/jobs/${id}`);

            setJob(res.data);
        }
        getJob();

    }, [])



    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
     }

    return (
        <div className='job-list-container'>
            {job && <Card className='job-detail-card'>
            <Card.Body>
        <Card.Title>{`${job.job_id} - ${job.job_name}`}</Card.Title>
        <Card.Text>
        {job.job_address_street_line1}
        {job.job_address_street_unit !== null && job.job_address_street_unit}
        <br></br>{job.job_address_street_city}
        <br></br>{job.job_description}<br></br>
        <ButtonGroup>
            
        <Button target="_blank" variant="outline-primary" href={job.shop_docs_link}>See Shop Docs</Button>
        <Button variant="outline-primary" onClick={handleShow}>
                New Timecard
            </Button>
          
        </ButtonGroup>
        {position === 3 && <ButtonGroup>
            <Button variant="outline-warning" onClick={handleShowInactiveWarning}>Mark Job Complete</Button>
            <Button  variant="outline-warning" onClick={handleShowJobEdit}>Edit Job Details</Button>
            </ButtonGroup>}
      
        </Card.Text>
            </Card.Body>

            </Card>}
            
            <AddTimecardForm showForm={showForm} handleClose={handleClose} job={job}
        employeeId = {employeeId} handleShowToast={handleShowToast} ></AddTimecardForm>

            
            {job && position === 3 && <InactiveWarning id={job.job_id} showInactiveWarning={showInactiveWarning} 
            handleCloseInactiveWarning= {handleCloseInactiveWarning}></InactiveWarning>}
            {job && position === 3 && <JobEditModal job={job} setShowJobEdit={setShowJobEdit}
            handleCloseJobEdit={handleCloseJobEdit} showJobEdit={showJobEdit}></JobEditModal>}
            <Toast onClose={handleCloseToast} show={showToast} delay={5000} autohide>
      <Toast.Body>Timecard added!</Toast.Body>
    </Toast>
        </div>

    )





}

export default JobDetail;