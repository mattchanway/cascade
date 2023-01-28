import React, { useState, useContext } from 'react';
import {redirect, Navigate} from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Login from './Login';
import UserContext from './UserContext';

function ResetPassword({ loggedInUser }) {



    let INIT_STATE = {
        password: '', confirmPassword: ''
    };

    const [passwordFormData, setPasswordFormData] = useState(INIT_STATE);
    const { employeeId, position, userNotFound } = useContext(UserContext);

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


        }
        catch (e) {
            console.log(e);
        }

    }

    function validatePasswords(str1, str2) {

        if (str1 !== str2) alert('no');


    }


    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
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

export default ResetPassword;