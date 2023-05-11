function DeleteTimecardRow({t}) {

    
    return (
        <>
                                <tr key={`${t.timecard_id}-row`}>
                                    <td key={`${t.timecard_id}-empIdCell`}>{t.employee_id}</td>
                                    <td key={`${t.timecard_id}-nameCell`}>{`${t.first_name} ${t.last_name}`}</td>
                                    <td key={`${t.timecard_id}-jobIdCell`}>{t.job_id}</td>
                                    <td key={`${t.timecard_id}-dateCell`}>{t.timecard_date.slice(0, 10)}</td>
                                    <td key={`${t.timecard_id}-regTimeCell`}>{t.reg_time}</td>
                                    <td key={`${t.timecard_id}-overtimeCell`}>{t.overtime}</td>
                                    <td key={`${t.timecard_id}-expensesCell`}>{'$'+t.expenses.toFixed(2)}</td>
                                    <td key={`${t.timecard_id}-buttonCell`}><Button variant='danger'>Delete</Button></td>
                                    
                                </tr>
                            

                      
        </>


    )



}

export default DeleteTimecardRow