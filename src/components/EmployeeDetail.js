import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Table from 'react-bootstrap/Table';
import { useLocation, useParams, useNavigate, redirect, Navigate } from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import baseURL from '../helpers/constants';
import Unauthorized from './Unauthorized';
import Card from 'react-bootstrap/Card';
import EmployeeEditModal from './EmployeeEditModal';
import EmployeeStatusChangeModal from './EmployeeStatusChangeModal';




function EmployeeDetail() {
    let { id } = useParams();
    const { employeeId, position, userNotFound } = useContext(UserContext);
    const [employee, setEmployee] = useState({});
    const [timecardResults, setTimecardResults] = useState([]);
    const [serverError, setServerError] = useState(false);
    const [showEmployeeEdit, setShowEmployeeEdit] = useState(false);
    const [showEmployeeStatusModal, setShowEmployeeStatusModal] = useState(false);
    const handleCloseEmployeeEdit = () => setShowEmployeeEdit(false);
    const handleShowEmployeeEdit = () => setShowEmployeeEdit(true);
    const handleCloseEmployeeStatusModal = () => setShowEmployeeStatusModal(false);
    const handleShowEmployeeStatusModal = () => setShowEmployeeStatusModal(true);


    useEffect(() => {

        async function getEmployee() {
            try {
                let res = await axios.get(`${baseURL}/employees/${id}`);
                
              
                setEmployee(res.data.userData);
                setTimecardResults(res.data.timecardsData)
           
            }
            catch (e) {

                setServerError(true);
            }
        }
        getEmployee();
    }, []);

    async function changeEmployeeStatus() {
    
        let updatedStatus = employee.status === true ? false : true

        try{
        let res = await axios.patch(`${baseURL}/employees/status/${employee.employee_id}`,{status: updatedStatus});
        handleCloseEmployeeStatusModal();

        }
        catch(e){
            setServerError(true);

        }
    }



    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    if(serverError === true){
  
        return <Navigate to="/404" replace={true}></Navigate>
    }

    if(employeeId !== null && position !== 3 && employeeId !== +id){
       
        return <Navigate to="/unauthorized" replace ={true}></Navigate>
    }

 
        return (
            <div>
                {employee && <Card className='job-detail-card'>
                    <Card.Body>
                <Card.Title>{employee.first_name} {employee.last_name}</Card.Title>
                <Card.Text>
                Employee ID: {employee.employee_id}
                </Card.Text> 
                {position === 3 && <ButtonGroup>
                    <Button variant='warning' onClick={handleShowEmployeeEdit} data-testid='emp-edit-btn' >Edit Employee</Button>
                    <Button onClick={handleShowEmployeeStatusModal} variant={employee.active ? 'danger' : 'success'} >{employee.active ? 'Deactivate Employee' : 'Activate Employee'}</Button>
                    </ButtonGroup> }
                 </Card.Body>
                    </Card>}
      
                <h2>{timecardResults && timecardResults.length ? 'All Timecards - Last 30 Days' : 'No timecards in last 30 days'}</h2>
                {timecardResults && 
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Timecard Date</th>
                                <th>Job Number</th>
                                <th>Job Name</th>
                                <th>Reg Time</th>
                                <th>Overtime</th>
                                <th>Expenses</th>
                                <th>Notes</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timecardResults.map(t =>
                                <tr key={`${t.timecard_id}-row`}>
                                    <td key={`${t.timecard_id}-dateCell`} >{t.timecard_date.slice(0, 10)}</td>
                                    <td key={`${t.timecard_id}-jobIdCell`}>{t.job_id}</td>
                                    <td key={`${t.timecard_id}-jobNameCell`}>{t.job_name}</td>
                                    <td key={`${t.timecard_id}-regTimeCell`}>{t.reg_time}</td>
                                    <td key={`${t.timecard_id}-overtimeCell`}>{t.overtime}</td>
                                    <td key={`${t.timecard_id}-expensesCell`}>{'$'+t.expenses.toFixed(2)}</td>
                                    <td key={`${t.timecard_id}-notesCell`}>{t.notes}</td>
                                    <td key={`${t.timecard_id}-timeSubCell`}>{t.time_submitted}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>}
                        {employee && position === 3 && <EmployeeEditModal employee={employee} 
                        handleCloseEmployeeEdit={handleCloseEmployeeEdit} 
                        showEmployeeEdit={showEmployeeEdit}></EmployeeEditModal>}
                         {employee && position === 3 && <EmployeeStatusChangeModal showEmployeeStatusModal={showEmployeeStatusModal}
                        handleCloseEmployeeStatusModal={handleCloseEmployeeStatusModal} changeEmployeeStatus={changeEmployeeStatus}
                      
                        ></EmployeeStatusChangeModal>}

            </div>
        )
    


}

export default EmployeeDetail;