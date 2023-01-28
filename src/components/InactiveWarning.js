import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function InactiveWarning({ id,showInactiveWarning, handleCloseInactiveWarning }) {
   

    async function makeJobInactive() {
        // BACKEND ROUTE DOES NOT EXIST YET
        // await axios.post(`/jobs/complete/${id}`)
        alert(id)
    }

    return (
        <>
            

            <Modal
                show={showInactiveWarning}
                onHide={handleCloseInactiveWarning}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will make the job inactive, and employees will no longer be able to see it as a job option in the main menu
                    for adding timecards.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInactiveWarning}>
                        Leave job active for now
                    </Button>
                    <Button variant="primary" onClick={makeJobInactive}>Mark this job inactive</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default InactiveWarning