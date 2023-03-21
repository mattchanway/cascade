import React from 'react';
import Table from 'react-bootstrap/Table';


function MyTimecardsReportResults({timecardResults}) {

  
    

    return (
        <div>
                <div className='report-table-wrapper'>
                    <Table hover={true} className='table' responsive>
                        <thead>
                            <tr>

                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Job Number</th>
                                <th>Job Name</th>
                                <th>Timecard Date</th>
                                <th>Reg Time</th>
                                <th>Overtime</th>
                                <th>Expenses</th>
                                <th>Notes</th>


                            </tr>
                        </thead>
                        <tbody>
                            {timecardResults.map(t =>
                                <tr>
                                    <td>{t.employee_id}</td>
                                    <td>{`${t.first_name} ${t.last_name}`}</td>
                                    <td>{t.job_id}</td>
                                    <td>{t.job_name}</td>
                                    <td>{t.timecard_date.slice(0, 10)}</td>
                                    <td>{t.reg_time}</td>
                                    <td>{t.overtime}</td>
                                    <td>{'$'+t.expenses.toFixed(2)}</td>
                                    <td>{t.notes}</td>


                                </tr>
                            )}

                        </tbody>
                    
                    </Table>
                   
                </div>
    
        
        </div>

    )




}

export default MyTimecardsReportResults;