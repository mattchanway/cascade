import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import JobForm from './JobForm';
import axios from 'axios';
import Login from './Login';

function JobEditModal({job, showJobEdit, handleCloseJobEdit}) {
    

    let { job_id, job_name, job_address_street_line1,
        job_address_street_unit, job_address_street_city, job_description,
        shop_docs_link } = job;

      



    return (
        <>
          

            <Modal
                show={showJobEdit}
                onHide={handleCloseJobEdit}
                keyboard={false}
            >
                <JobForm edit={true} jobNumber={job_id} jobName={job_name} addressLine1={job_address_street_line1}
                    addressLine2={job_address_street_unit} city={job_address_street_city} description={job_description} link={shop_docs_link} ></JobForm>
            </Modal>
        </>
    );
}

export default JobEditModal