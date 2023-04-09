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
                                <tr key={`${t.timecard_id}-row`}>
                                    <td key={`${t.timecard_id}-empIdCell`}>{t.employee_id}</td>
                                    <td key={`${t.timecard_id}-nameCell`}>{`${t.first_name} ${t.last_name}`}</td>
                                    <td key={`${t.timecard_id}-jobIdCell`}>{t.job_id}</td>
                                    <td key={`${t.timecard_id}-jobNameCell`}>{t.job_name}</td>
                                    <td key={`${t.timecard_id}-dateCell`}>{t.timecard_date.slice(0, 10)}</td>
                                    <td key={`${t.timecard_id}-regTimeCell`}>{t.reg_time}</td>
                                    <td key={`${t.timecard_id}-overtimeCell`}>{t.overtime}</td>
                                    <td key={`${t.timecard_id}-expensesCell`}>{'$'+t.expenses.toFixed(2)}</td>
                                    <td key={`${t.timecard_id}-notesCell`}>{t.notes}</td>


                                </tr>
                            )}

                        </tbody>
                    
                    </Table>
                   
                </div>
    
        
        </div>

    )




}

export default MyTimecardsReportResults;