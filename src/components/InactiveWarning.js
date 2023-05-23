import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import baseURL from '../helpers/constants';

function InactiveWarning({ id,showInactiveWarning, handleCloseInactiveWarning, setServerError }) {
   

    async function makeJobInactive() {

        try{
        let res = await axios.patch(`${baseURL}/jobs/${id}`,{status:false});
        handleCloseInactiveWarning();

        }
        catch(e){
            setServerError(true);

        }
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