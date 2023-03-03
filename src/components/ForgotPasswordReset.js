import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import baseURL from '../helpers/constants';

function ForgotPasswordReset({setLoggedInUser}) {

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

    async function handlePasswordSubmit(password) {
       
        try {
            let res = await axios.post(`${baseURL}/auth/password-forgotten-update/${token}`, {password});
            console.log('SUBMIT RESP', res.data)
            setLoggedInUser({employeeId: res.data.employee_id,
                position: res.data.position,
                firstName: res.data.first_name,
                lastName: res.data.last_name,
                userNotFound: false,
                firstLogin: res.data.first_login});
            navigate('/');

            // post to "/password-update/:token"
            // useParams - should make one call to server upon page load to check that token is still valid,
            // if not, can redirect to 404 page. then, if valid, will validate token again.


        }
        catch (e) {
            setServerError(true)
        }

    }

    function validatePasswords(evt) {
        evt.preventDefault();
        let { password, confirmPassword } = passwordFormData;
        if (password !== confirmPassword) {alert('no');}
        else{
        handlePasswordSubmit(password);
        }


    }




    return (
        <Form onSubmit={validatePasswords}>
            <Form.Group className="mb-3" controlId="expensesInput">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="notesInput">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">Submit Password</Button>
        </Form>

    )





}

export default ForgotPasswordReset;