import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import Login from './Login';
import Unauthorized from './Unauthorized';
import FourOhFour from './FourOhFour';
import userEvent from '@testing-library/user-event';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

jest.mock('axios')

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: ()=> mockedUseNavigate

}))

it('Allows manager to create new employee', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
  
        const mockParams = {positions: [{
        position_id:1,
        position_name: 'chef'
    },
    {
        position_id:2,
        position_name: 'plumber'
    },
    {
        position_id:3,
        position_name: 'cop'
    }],
    certifications: [{
        certification_id: 1,
        certification_name: 'None'
    },
    {
        certification_id: 2,
        certification_name: 'Apprentice'
    }]


    }

    axios.get = jest.fn().mockResolvedValue({ data: mockParams })
    await act(async () => {
        render(
       
            <UserContext.Provider value={mockManager}>
                <EmployeeForm></EmployeeForm>
            </UserContext.Provider>
        )

    });
    expect(screen.getByText(/Apprentice/)).toBeInTheDocument()

        let fName = screen.getByTestId('first_name_test')
        let lName = screen.getByTestId('last_name_test')
        let email = screen.getByTestId('email_test')
        let posSelect = screen.getByTestId('posSelect')
        let certSelect = screen.getByTestId('certSelect')
        let submitBtn = screen.getByTestId('emp-form-submit');
        let dateSelect = screen.getByTestId('dateSelect');


    await act(async () => {

        userEvent.type(fName, 'Chode')
        userEvent.type(lName, 'Gomely')
        userEvent.type(email,'CGomes@gmail.ca');
        userEvent.selectOptions(posSelect, '1');
        userEvent.selectOptions(certSelect, '1');
        fireEvent.change(dateSelect, {target:{value:'2023-01-01'}})

    });
    expect(posSelect).toHaveValue('1');
    expect(certSelect).toHaveValue('1');
    axios.post = jest.fn().mockResolvedValue(true)

    await act(async () => {

        userEvent.click(submitBtn)

    });
    expect(mockedUseNavigate).toHaveBeenCalled()

})

it('Redirects to 404 if post request throws', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
  
        const mockParams = {positions: [{
        position_id:1,
        position_name: 'chef'
    },
    {
        position_id:2,
        position_name: 'plumber'
    },
    {
        position_id:3,
        position_name: 'cop'
    }],
    certifications: [{
        certification_id: 1,
        certification_name: 'None'
    },
    {
        certification_id: 2,
        certification_name: 'Apprentice'
    }]


    }

    axios.get = jest.fn().mockResolvedValue({ data: mockParams })
    await act(async () => {
            render(
            <MemoryRouter initialEntries={["/employees/new-employee"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/employees/new-employee" element={<EmployeeForm></EmployeeForm>} ></Route>
                    <Route path="/404" element={<FourOhFour></FourOhFour>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Apprentice/)).toBeInTheDocument()

        let fName = screen.getByTestId('first_name_test')
        let lName = screen.getByTestId('last_name_test')
        let email = screen.getByTestId('email_test')
        let posSelect = screen.getByTestId('posSelect')
        let certSelect = screen.getByTestId('certSelect')
        let submitBtn = screen.getByTestId('emp-form-submit');
        let dateSelect = screen.getByTestId('dateSelect');


    await act(async () => {

        userEvent.type(fName, 'Chode')
        userEvent.type(lName, 'Gomely')
        userEvent.type(email,'CGomes@gmail.ca');
        userEvent.selectOptions(posSelect, '1');
        userEvent.selectOptions(certSelect, '1');
        fireEvent.change(dateSelect, {target:{value:'2023-01-01'}})

    });
    expect(posSelect).toHaveValue('1');
    expect(certSelect).toHaveValue('1');
    axios.post = jest.fn().mockRejectedValue(new Error('err'))

    await act(async () => {

        userEvent.click(submitBtn)

    });
    expect(screen.getByText(/404. That's an error/)).toBeInTheDocument()

})



// it('Manager can access edit form and edit employee', async () => {

//     const mockManager = {
//         employeeId: 1,
//         position: 3,
//         firstName: 'Shawn',
//         lastName: 'Rostas',
//         userNotFound: false,
//         firstLogin: false
//     }
//     const mockEmployee = {
//         userData: {
//             first_name: 'Bud',
//             last_name: 'Gormley',
//             position_name: 'Employee',
//             position:2,
//             certification: 2,
//             certification_name: 'None',
//             employee_id: 25,
//             email:'budgormley@gmail.com',
//             start_date: '2023-01-01'
//         },
//         timecardsData: [{
//             timecard_date: '2023-01-01',
//             job_id: '123b',
//             job_name: 'Stadium',
//             reg_time: 8,
//             overtime: 0,
//             expenses: 0,
//             notes: 'Some notes here',
//             time_submitted: 'Would go here'
//         }
//         ]
//     }

//     const mockParams = {positions: [{
//         position_id:1,
//         position_name: 'chef'
//     },
//     {
//         position_id:2,
//         position_name: 'plumber'
//     },
//     {
//         position_id:3,
//         position_name: 'cop'
//     }],
//     certifications: [{
//         certification_id: 1,
//         certification_name: 'None'
//     },
//     {
//         certification_id: 2,
//         certification_name: 'Apprentice'
//     }]


//     }

//     axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    
//     await act(async () => {

//         render(
//             <MemoryRouter initialEntries={["/employees/25"]}>
//                 <UserContext.Provider value={mockManager}>
//                 <Routes>
//                     <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
//                     </Routes>
//                 </UserContext.Provider>
//             </MemoryRouter>
//         )
        

//     });

//     axios.get = jest.fn().mockResolvedValue({ data: mockParams })
//     let editBtn = screen.getByTestId('emp-edit-btn')
    


//     await act(async () => {
//         userEvent.click(editBtn);
    

//     })
//     let fName = screen.getByTestId('first_name_test')
//         let posSelect = screen.getByTestId('posSelect')
//         let certSelect = screen.getByTestId('certSelect')
//         let submitBtn = screen.getByTestId('emp-form-submit');

//     await act(async() => {
        
//             userEvent.type(fName, '{backspace}')
//             userEvent.type(fName, '{backspace}')
//             userEvent.type(fName, '{backspace}')
//             userEvent.type(fName, 'Chud')
//             userEvent.selectOptions(posSelect, '1');
//             userEvent.selectOptions(certSelect, '1');
//     })
//     expect(certSelect).toHaveValue('1')
//     expect(posSelect).toHaveValue('1')
//     axios.put = jest.fn().mockResolvedValue(true)
//     await act(async() => {
        
//         userEvent.click(submitBtn)
// })

//     expect(mockedUseNavigate).toHaveBeenCalled();

// })