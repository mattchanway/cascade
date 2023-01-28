import React, {useContext} from 'react';
import UserContext from './UserContext';




function Timecard() {

    const { employeeId, position, userNotFound } = useContext(UserContext);



    return (
        <Navbar>
            <Nav.Link href="/">All Jobs</Nav.Link>
            {position === 3 && <Nav.Link href="/reports">Reports</Nav.Link>}
        </Navbar>

    )





}

export default Timecard;