import React, { useState, useContext } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import axios from "axios";
import ForgotPasswordModalForm from './ForgotPasswordModalForm';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import cascadeLogo from '../assets/cascade_logo.png'
import '../App.css';
import baseURL from '../helpers/constants';
import Alert from 'react-bootstrap/Alert';

function Login({ setLoggedInUser }) {

    const [serverError, setServerError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    let INIT_STATE = {
        id: '', password: ''
    };

    const [loginFormData, setLoginFormData] = useState(INIT_STATE);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setLoginFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleLoginSubmit(evt) {
        evt.preventDefault();
        try {

            let { id, password } = loginFormData;
            let totalUrl = `${baseURL}/auth`
           
            let res = await axios.post(totalUrl, {
                id, password
            })
           
         
            if (res.data && res.data.employee_id) {
                console.log('made it to end of if')
                setLoggedInUser({
                    employeeId: res.data.employee_id, position: res.data.position, firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    userNotFound: false,
                    firstLogin: res.data.first_login
                });
                setPasswordErrors([])
                navigate('/');
                
            }
            else {
                setPasswordErrors(['Incorrect password or user not found.'])
              
            }
        }
        catch (e) {
            console.log(e)
            setServerError(true);
            
        }

    }

   

if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div id='login-form-container'>
        
            <Form onSubmit={handleLoginSubmit} id='login-form' data-testid='loginForm' >
                <Image id="test" src={cascadeLogo} fluid="true"></Image>
                
                <Form.Group className = "mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                type="text"
                name="id"
                value={loginFormData.id}
                onChange={handleChange}
                >
                </Form.Control>
                </Form.Group>

                <Form.Group className = "mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleChange}
                >
                </Form.Control>
                </Form.Group>
            <Button className='buttons' type="submit" data-testid='init-login-btn'>Login</Button>

            {passwordErrors && passwordErrors.map((err)=><Alert variant ="danger">{err}</Alert>)}

            </Form>

            <Button className='buttons' href="/accounts/password/reset">Forgot Password</Button>
            {/* <Modal
                show={show}
                onHide={handleClose}
            >
                <ForgotPasswordModalForm handleClose={handleClose}></ForgotPasswordModalForm>

            </Modal> */}



        </div>)





}

export default Login;