// import '../css/App.css';
import React, { useState } from 'react';



function JobDescriptionCard({ job_id, job_name, job_address_street_line1, job_address_street_unit,
    job_address_street_city, job_description }) {





    return (
        <div>
            <h2>{job_name}</h2>
            <p>{job_address_street_line1}</p>
        </div>

    )





}

export default JobDescriptionCard;