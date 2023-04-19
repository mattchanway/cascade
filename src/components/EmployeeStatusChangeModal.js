import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';


function EmployeeStatusChangeModal({ handleCloseEmployeeStatusModal, showEmployeeStatusModal, changeEmployeeStatus,
employee_id, status }) {
   

   

    return (
        <>
            <Modal
                show={showEmployeeStatusModal}
                onHide={handleCloseEmployeeStatusModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will make the employee inactive. They will not be able to login or post timecards, unless you reactivate their account.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEmployeeStatusModal}>
                        Leave employee active for now
                    </Button>
                    <Button variant="primary" onClick={(employee_id, status)=> changeEmployeeStatus(employee_id, status)}>Mark this employee inactive</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EmployeeStatusChangeModal