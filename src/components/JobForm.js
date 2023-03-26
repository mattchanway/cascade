import React, { useContext, useState } from 'react';
import UserContext from './UserContext';
import { useNavigate, Link, Navigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import baseURL from '../helpers/constants';

function JobForm({ edit, jobNumber, jobName, addressLine1, addressLine2, city, description, link }) {

    const [serverError, setServerError] = useState(false);
    const { employeeId, position, firstName, lastName, userNotFound } = useContext(UserContext);
    const BTN_VAL = edit === true ? "Edit Job" : "Add New Job";
    const navigate = useNavigate();

    const INIT_STATE = edit !== true ? {
        job_id: '', job_name: '', job_address_street_line1: '',
        job_address_street_line2: '', job_address_street_city: '', job_description: '',
        shop_docs_link: ''
    } : {
        job_id: jobNumber, job_name: jobName, job_address_street_line1: addressLine1,
        job_address_street_line2: addressLine2, job_address_street_city: city, job_description: description,
        shop_docs_link: link
    }

    const [jobFormData, setJobFormData] = useState(INIT_STATE);

    async function postNewJob(evt) {
        evt.preventDefault();
        try {
            let { job_id, job_name, job_address_street_line1,
                job_address_street_line2, job_address_street_city, job_description,
                shop_docs_link } = jobFormData;
            let res = !edit ? await axios.post(`${baseURL}/jobs`, {
                job_id, job_name, job_address_street_line1,
                job_address_street_line2, job_address_street_city, job_description,
                shop_docs_link
            }) : await axios.put(`${baseURL}/jobs/${job_id}`, {
                job_name, job_address_street_line1,
                job_address_street_line2, job_address_street_city, job_description,
                shop_docs_link
            })
            let newId = res.data.job_id;
            navigate(`/`);

        }
        catch (e) {
            setServerError(true)
        }
    }

    const handleChange = evt => {

        const { name, value } = evt.target;
        setJobFormData(fData => ({
            ...fData,
            [name]: value
        }))

    }

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
     }
     if(position !== 3) return <Navigate to="/unauthorized" replace={false}></Navigate>

     if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    return (
        <div>
            <h1>{BTN_VAL}</h1>
            <Form onSubmit={postNewJob}>

                <Form.Group className="mb-3" controlId="jobNumber">
                    <Form.Label>Job Number</Form.Label>
                    <Form.Control
                        disabled={edit === true ? true : false}
                        type="text"
                        name="job_id"
                        value={jobFormData.job_id}
                        onChange={handleChange}
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="jobName">
                    <Form.Label>Job Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="job_name"
                        value={jobFormData.job_name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="jobAddressStreetLine1">
                    <Form.Label>Job Address Line 1</Form.Label>
                    <Form.Control
                        type="text"
                        name="job_address_street_line1"
                        value={jobFormData.job_address_street_line1}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="jobAddressStreetLine2">
                    <Form.Label>Job Address Line 2</Form.Label>
                    <Form.Control
                        type="text"
                        name="job_address_street_line2"
                        value={jobFormData.job_address_street_line2}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="jobAddressStreetCity">
                    <Form.Label>Job Address City</Form.Label>
                    <Form.Control
                        type="text"
                        name="job_address_street_city"
                        value={jobFormData.job_address_street_city}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="jobDescription">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control
                        type="textarea"
                        name="job_description"
                        value={jobFormData.job_description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="shopDocsLink">
                    <Form.Label>Shop Docs Link</Form.Label>
                    <Form.Control
                        type="text"
                        name="shop_docs_link"
                        value={jobFormData.shop_docs_link}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">{BTN_VAL}</Button>
            </Form>

        </div>

    )





}

export default JobForm;