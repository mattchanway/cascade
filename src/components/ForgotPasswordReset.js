import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import baseURL from '../helpers/constants';
import Alert from 'react-bootstrap/Alert';

function ForgotPasswordReset({setLoggedInUser}) {

    const [passwordErrors, setPasswordErrors] = useState([])
    const [serverError, setServerError] = useState(false);
    const {token} = useParams();
    let navigate = useNavigate();

    let INIT_STATE = {
        password: '', confirmPassword: ''
    };

    const [passwordFormData, setPasswordFormData] = useState(INIT_STATE);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setPasswordFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handlePasswordSubmit(evt) {
       
        try {
            evt.preventDefault();
            let check = validatePasswords(passwordFormData.password, passwordFormData.confirmPassword);

            if(check === true){
            let res = await axios.post(`${baseURL}/auth/password-forgotten-update/${token}`, {password: passwordFormData.password});

            if(res.data.invalidToken){
                setPasswordErrors(['Invalid request. Ensure you are submitting the password reset request within 10 minutes.'])
                
            }
            else{
            setLoggedInUser({employeeId: res.data.employee_id,
                position: res.data.position,
                firstName: res.data.first_name,
                lastName: res.data.last_name,
                userNotFound: false,
                firstLogin: res.data.first_login});
            navigate('/');
                setPasswordErrors([])
            }
            }

        }
        catch (e) {
            setServerError(true)
        }

    }

    function validatePasswords(str1, str2) {
        
        if (str1 !== str2) {
            let passwordsDontMatchError = 'Passwords do not match.';
                setPasswordErrors([passwordsDontMatchError])
            return false;}
        if(str1 === str2 && str1.length < 8){
            let shortError = 'Password must be at least 8 characters';
                setPasswordErrors([shortError])
            return false;

        }
        
        return true


    }

    
    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <Form onSubmit={handlePasswordSubmit}>
            {passwordErrors && passwordErrors.map((err)=><Alert key={err} variant ="danger">{err}</Alert>)}
            <Form.Group className="mb-3" controlId="expensesInput">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    data-testid='ForgotPasswordResetPassword'
                    type="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="notesInput">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                data-testid='ForgotPasswordResetPasswordConfirm'
                    type="password"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit" data-testid='ForgotPasswordResetPasswordSubmit' >Submit Password</Button>
        </Form>

    )





}

export default ForgotPasswordReset;