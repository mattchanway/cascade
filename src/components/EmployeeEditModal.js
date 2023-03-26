import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import JobForm from './JobForm';
import axios from 'axios';
import Login from './Login';
import EmployeeForm from './EmployeeForm';

function EmployeeEditModal({employee, showEmployeeEdit, handleCloseEmployeeEdit}) {
    

    let {employee_id, first_name, last_name, email, position, certification, start_date  } = employee;

 
    let sliceDate = start_date ? start_date.slice(0,10) : ''
    console.log('modal paretn', employee)

    return (
        <>
          

            <Modal
                show={showEmployeeEdit}
                onHide={handleCloseEmployeeEdit}
                keyboard={false}
            >
                {employee && <EmployeeForm edit={true} employee_id={employee_id} first_name={first_name} last_name={last_name}
                email={email} empPosition={position} certification={certification} start_date={sliceDate}></EmployeeForm>}
            </Modal>
        </>
    );
}

export default EmployeeEditModal