import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import baseURL from '../helpers/constants';

function DeleteTimecardModal({ id,showInactiveWarning, handleCloseInactiveWarning, setServerError }) {
   

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
                    This will DELETE the selected timecard.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInactiveWarning}>
                        Leave For Now
                    </Button>
                    <Button variant="primary" onClick={makeJobInactive}>Delete Timecard</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteTimecardModal