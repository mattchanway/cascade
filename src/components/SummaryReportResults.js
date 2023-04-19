import React from 'react';
import Table from 'react-bootstrap/Table';


function SummaryReportResults({results}) {

  


    return !results.length ? '' :  (
        <div>
                <div className='report-table-wrapper'>
                    <Table hover={true} className='table' responsive>
                        <thead>
                            <tr>
                                <th>Job Number</th>
                                <th>Job Name</th>
                                <th>Total Reg Time</th>
                                <th>Total Overtime</th>
                                <th>Total Expenses</th>

                            </tr>
                        </thead>
                        <tbody>
                            {results.map(t =>
                                <tr key={`${t.job_id}-row`}>
                                    <td key={`${t.job_id}-jobIdCell`}>{t.job_id}</td>
                                    <td key={`${t.job_id}-jobNameCell`}>{t.job_name}</td>
                                    <td key={`${t.job_id}-regTimeCell`}>{t.reg_time_total}</td>
                                    <td key={`${t.job_id}-overtimeCell`}>{t.overtime_total}</td>
                                    <td key={`${t.job_id}-expCell`}>{t.expenses_total}</td>
                                </tr>
                            )}

                        </tbody>
                    
                    </Table>
                   
                </div>
    
        
        </div>

    )




}

export default SummaryReportResults;