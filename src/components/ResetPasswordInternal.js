import React, { useState, useContext } from 'react';
import {redirect, Navigate, useNavigate} from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Login from './Login';
import UserContext from './UserContext';

function ResetPassword({ loggedInUser, setLoggedInUser }) {


    const navigate = useNavigate();
    let INIT_STATE = {
        oldPassword: '', password: '', confirmPassword: ''
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
            let res = await axios.patch(`/employees/${employeeId}`,{oldPassword: passwordFormData.oldPassword, password: passwordFormData.password,
            firstLogin: firstLogin})
            setPasswordFormData(INIT_STATE);
            console.log(res)
            setLoggedInUser({
                employeeId: res.data.employee_id,
                position: res.data.position,
                firstName: res.data.first_name,
                lastName: res.data.last_name,
                userNotFound: false,
                firstLogin: res.data.first_login})
            navigate('/');
            

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
        <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwordFormData.oldPassword}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
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