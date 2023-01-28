import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ResourceErrorAlert from './ResourceErrorAlert';

function EmployeeForm({ edit, firstName, lastName, position, certification, start_date, address }) {


    const BTN_VAL = edit === true ? "Edit Employee" : "Add New Employee";
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { employeeId, userNotFound } = useContext(UserContext);

    let {id} = useParams();

    const INIT_STATE = edit !== true ? {
        first_name: '', last_name: '', position: '',
        certification: '', start_date: null, address: ''
    } : {
        firstName, lastName, position, certification, start_date, address
    }

    const [employeeFormData, setEmployeeFormData] = useState(INIT_STATE);
    const [certificationOptions, setCertificationOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);

    useEffect(() => {

        async function getPositionsAndCertifications() {
            try{
            let res = await axios.get(`/employees/params`);
            setIsLoading(false);
            setCertificationOptions(res.data.certifications);
            setPositionOptions(res.data.positions);
            }
            
            catch(e){
             console.log(e)
            }

        }
        getPositionsAndCertifications();

    }, []);

    async function postNewEmployee(evt) {
        evt.preventDefault();
        try {
            let { first_name, last_name, position,
            certification, start_date, address} = employeeFormData;

            let res = !edit ? await axios.post(`/employees`, {
                first_name, last_name, position,
                certification, start_date, address
            }) : await axios.put(`/employees/${id}`, {
                first_name, last_name, position,
            certification, start_date, address
            })
            console.log(res.data)
            navigate(`/`);

        }
        catch (e) {
        }
    }

    const handleChange = evt => {

        const { name, value } = evt.target;
        setEmployeeFormData(fData => ({
            ...fData,
            [name]: value
        }))
        console.log(employeeFormData)
    }

    if(isLoading === true) return (
        <div>
            Loading
        </div>
    )



    return (
        <div>
            <h1>{BTN_VAL}</h1>
            <Form onSubmit={postNewEmployee}>

                <Form.Group className="mb-3" controlId="first-name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        disabled={edit === true ? true : false}
                        type="text"
                        name="first_name"
                        value={employeeFormData.first_name}
                        onChange={handleChange}
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="last-name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={employeeFormData.last_name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="select"
                        name="position"
                        value={employeeFormData.position}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={null}>Position</option>
                        {positionOptions && positionOptions.map(pos => <option value={pos.position_id}>{pos.position_name}</option>)}
                    </Form.Control>

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="select"
                        name="certification"
                        value={employeeFormData.certification}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value={null}>Certification</option>
                        {certificationOptions && certificationOptions.map(c => <option value={c.certification_id}>{c.certification_name}</option>)}
                    </Form.Control>

                </Form.Group>

               
                    <Form.Group className="mb-3" controlId="start-date-input">
                    <Form.Label>Start Date *must be YYYY-MM-DD*</Form.Label>
                    <Form.Control

                        name="start_date"
                        value={employeeFormData.start_date}
                        onChange={handleChange}
                        type="date"
                        autoFocus
                    />
                </Form.Group>
               
                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={employeeFormData.address}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">{BTN_VAL}</Button>
            </Form>

        </div>

    )





}

export default EmployeeForm;