import React, { useState, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import ForgotPasswordModalForm from './ForgotPasswordModalForm';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import cascadeLogo from '../assets/cascade_logo.png'
import '../App.css';
import baseURL from '../helpers/constants';


function Login({ setLoggedInUser }) {

   

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
            console.log(totalUrl)
            let res = await axios.post(totalUrl, {
                id, password
            })
            if (res.data && res.data.employee_id) {
                setLoggedInUser({
                    employeeId: res.data.employee_id, position: res.data.position, firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    userNotFound: false,
                    firstLogin: res.data.first_login
                });
                navigate('/');
            }
            else {
                alert('false');
            }
        }
        catch (e) {
            console.log(e);
        }

    }



    return (
        <div id='login-form-container'>
        
            <Form onSubmit={handleLoginSubmit} id='login-form' >
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
            <Button className='buttons' type="submit">Login</Button>

            </Form>

            <Button className='buttons' href="/accounts/password/reset">Forgot Password</Button>
            <Modal
                show={show}
                onHide={handleClose}
            >
                <ForgotPasswordModalForm handleClose={handleClose}></ForgotPasswordModalForm>

            </Modal>



        </div>)





}

export default Login;