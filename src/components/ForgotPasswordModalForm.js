import React, { useState, useContext } from 'react';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Toast from 'react-bootstrap/Toast';
import cascadeLogo from '../assets/cascade_logo.png'
import baseURL from '../helpers/constants';

function ForgotPasswordModalForm() {

    const SERVICE_ID = 'service_oiiez3e';
    const TEMPLATE_ID = 'template_l8jr3ja';
    const USER_ID = 'wZz95RyY_sSyuMVhA';
    const PUBLIC_KEY = 'wZz95RyY_sSyuMVhA';


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

            let res = await axios.get(`${baseURL}/auth/password-token/${id}`);
            const resetLink = `http://localhost:3000/reset-password/${res.data.passwordToken}`;
            if(!res.data.email) throw new Error()
            setFeedbackEmail(res.data.email);
            setShowToast(true);
            let TEMPLATE_PARAMS = { resetLink: resetLink, userEmail: res.data.email };
          
            emailjs.send(SERVICE_ID, TEMPLATE_ID, TEMPLATE_PARAMS, PUBLIC_KEY).then(function (res) {
                console.log(res.status, res.text)

            })
            setPasswordFormData(INIT_STATE);
            
        }
        catch (e) {
            console.log('Bad request - no user found');
        }

    }

    
    return (

        <div id='login-form-container'>
            <p>Enter employee ID to receive password reset link</p>
            
            <Form onSubmit={handleIdSubmit} id='login-form'>
            <Image id="test" src={cascadeLogo} fluid="true"></Image>
                
                <Form.Group className = "mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                type="text"
                name="id"
                value={passwordFormData.id}
                onChange={handleChange}
                >
                </Form.Control>
                </Form.Group>
            <Button type="submit">Send Password Reset Link</Button>
            </Form>

            <Toast onClose={handleCloseToast} show={showToast} delay={5000} autohide>
      <Toast.Body>A link to reset your password has been sent to {feedbackEmail}</Toast.Body>
    </Toast>
        </div>

    )





}

export default ForgotPasswordModalForm;