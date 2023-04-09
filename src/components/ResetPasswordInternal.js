import React, { useState, useContext } from 'react';
import { redirect, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Login from './Login';
import UserContext from './UserContext';
import baseURL from '../helpers/constants';
import Alert from 'react-bootstrap/Alert';

function ResetPassword({ loggedInUser, setLoggedInUser }) {

    const [serverError, setServerError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([])

    const navigate = useNavigate();
    let INIT_STATE = {
        password: '', confirmPassword: ''
    };

    const [passwordFormData, setPasswordFormData] = useState(INIT_STATE);
    const { employeeId, position, userNotFound, firstLogin } = useContext(UserContext);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setPasswordFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handlePasswordSubmit(evt) {
        evt.preventDefault();
        try {
            let check = validatePasswords(passwordFormData.password, passwordFormData.confirmPassword);
        
            if (check === true) {
                let res = await axios.patch(`${baseURL}/employees/${employeeId}`, {
                    password: passwordFormData.password,
                    firstLogin: firstLogin
                })
                
                setPasswordFormData(INIT_STATE);
                setPasswordErrors([]);

                setLoggedInUser({
                    employeeId: res.data.employee_id,
                    position: res.data.position,
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    userNotFound: false,
                    firstLogin: res.data.first_login
                })
                
                navigate('/');
            }

        }
        catch (e) {
            
            setServerError(true);
        }

    }

    function validatePasswords(str1, str2) {

        if (str1 !== str2) {
            let passwordsDontMatchError = 'Passwords do not match.';
            setPasswordErrors([passwordsDontMatchError])
            return false;
        }
        if (str1 === str2 && str1.length < 8) {
            let shortError = 'Password must be at least 8 characters';
            setPasswordErrors([shortError])
            return false;

        }

        return true


    }


    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    if (serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <Form onSubmit={handlePasswordSubmit}>
            {passwordErrors && passwordErrors.map(err => <Alert key={err} variant="danger">{err}</Alert>)}

            <Form.Group className="mb-3">
                <Form.Label>Set New Password</Form.Label>
                <Form.Control
                    data-testid="reset-pw-input"
                    type="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                    data-testid="reset-confirm-input"
                    type="password"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit" data-testid="reset-pw-submit">Submit Password</Button>
        </Form>

    )





}

export default ResetPassword;