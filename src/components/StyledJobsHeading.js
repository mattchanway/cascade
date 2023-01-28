import React, {useContext} from 'react';
import UserContext from './UserContext';




function StyledJobsHeading() {

    const { employeeId, position, userNotFound } = useContext(UserContext);



    return (
        <div className='cutout'>
           
            <h1>Select A Job</h1>
           
            
        </div>

    )





}

export default StyledJobsHeading;