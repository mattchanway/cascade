import React, { useState, useContext } from 'react';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';
import Button from 'react-bootstrap/Button';
import { useNavigate, Navigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Toast from 'react-bootstrap/Toast';
import cascadeLogo from '../assets/cascade_logo.png'
import baseURL from '../helpers/constants';
import Alert from 'react-bootstrap/Alert';

function ForgotPasswordModalForm() {

    const SERVICE_ID = 'service_uj3e4ws';
    const TEMPLATE_ID = 'template_l8jr3ja';
    const USER_ID = 'wZz95RyY_sSyuMVhA';
    const PUBLIC_KEY = 'wZz95RyY_sSyuMVhA';
    const [serverError, setServerError] = useState(false);
    const [formErrors, setFormErrors] = useState([])

    const PASSWORD_RESET_BASEURL = process.env.NODE_ENV === 'production' ? 'https://cascademetaldesign.work' : 'http://localhost:3000'


    let INIT_STATE = {
        id: ''
    };

    const [passwordFormData, setPasswordFormData] = useState(INIT_STATE);
    const [showToast, setShowToast] = useState(false);
    const [feedbackEmail, setFeedbackEmail] = useState('');
    function handleCloseToast(){
        setShowToast(false);
        setFeedbackEmail('');
    }

    const handleChange = evt => {
        const { name, value } = evt.target;
        setPasswordFormData(fData => ({
            ...fData,
            [name]: value
        }))
      
    }

    async function handleIdSubmit(evt) {
      
        evt.preventDefault();
        try {

            let { id } = passwordFormData;

            let res = await axios.post(`${baseURL}/auth/password-token/${id}`);
          
            if(res.data.userNotFound){
                setFormErrors(['No user exists with that ID.']);
            }
            else{
            const resetLink = `${PASSWORD_RESET_BASEURL}/reset-password/${res.data.passwordToken}`;
            setFormErrors([])
            setFeedbackEmail(res.data.email);
            setShowToast(true);
            let TEMPLATE_PARAMS = { resetLink: resetLink, userEmail: res.data.email };
          
            emailjs.send(SERVICE_ID, TEMPLATE_ID, TEMPLATE_PARAMS, PUBLIC_KEY);

            setPasswordFormData(INIT_STATE);
            }
            
        }
        catch (e) {
            setServerError(true)
        }

    }

    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>
    
    return (

        <div className ='reset-password-internal-container'>
            <p><b>Enter your employee ID - we'll send a password reset link to your email.</b></p>
            
            <Form onSubmit={handleIdSubmit} id='login-form'>
            {formErrors &&  formErrors.map((e)=> <Alert key={e} variant="danger">{e}</Alert>)}
            {/* <Image id="test" src={cascadeLogo} fluid="true"></Image> */}
                
                <Form.Group className = "mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                data-testid="forgotPasswordModalFormEmployeeId"
                type="text"
                name="id"
                value={passwordFormData.id}
                onChange={handleChange}
                >
                </Form.Control>
                </Form.Group>
            <Button  className='cascade-color-button' type="submit" data-testid="forgotPasswordModalFormSubmit">Send Password Reset Link</Button>
            </Form>

            <Toast onClose={handleCloseToast} show={showToast} delay={5000} autohide>
      <Toast.Body>A link to reset your password has been sent to {feedbackEmail}</Toast.Body>
    </Toast>
        </div>

    )





}

export default ForgotPasswordModalForm;