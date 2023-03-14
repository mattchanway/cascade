import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import App from './App';
import axios from 'axios'
import Jobs from './components/Jobs'
import UserContext from './components/UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Admin from './components/Admin';
import EmployeeDetail from './components/EmployeeDetail';
import TimecardsFilterReport from './components/TimecardsFilterReport';
import TimecardsFilterReportForm from './components/TimecardsFilterReportForm';

jest.mock('axios')

it('Shows the login box when rendered and no user is found', async () => {

    const mockNoUser = {data: {
        noUser: 'Cannot find'
    }}
    axios.get = jest.fn().mockResolvedValue(mockNoUser)
    await act(async () => {
        
        render(<App></App>)
      });
    expect(screen.getByText('Login')).toBeInTheDocument()

})

it('Shows the jobs list when rendered and valid user is found', async () => {

    const mockJobsList = [{job_id: '1', job_name: 'Fake 1', 
    job_address_street_line1: '123 Fake St', job_address_street_unit:'#5', job_address_street_city: 'Surrey'},
    {job_id: '2', job_name: 'Fake 2', 
    job_address_street_line1: '456 Fake St', job_address_street_unit:'#6', job_address_street_city: 'Surrey'},
    {job_id: '3', job_name: 'Fake 3', 
    job_address_street_line1: '789 Fake St', job_address_street_unit:'#10', job_address_street_city: 'Vancouver'}]

    const mockUser = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}


    axios.get = jest.fn().mockResolvedValue({data : mockJobsList})
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockUser}>
            <Jobs></Jobs>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/789 Fake St #10 Vancouver/)).toBeInTheDocument()

})

it('Shows the admin list when the manager accesses', async () => {

    const mockUser = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}
    // axios.get = jest.fn().mockResolvedValue({data : mockJobsList})
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockUser}>
            <Admin></Admin>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/Employee Admin/)).toBeInTheDocument()

})

// it('Shows the admin list as unauthorized when the non-manager accesses', async () => {
// *************************IS NOT IMPLEMENTED**********************************
//     const mockUser = {data: {
//         employeeId: 2,
//             position: 2,
//             firstName: 'Non',
//             lastName: 'Manager',
//             userNotFound: false,
//             firstLogin: false
//     }}
//     // axios.get = jest.fn().mockResolvedValue({data : mockJobsList})
//     await act(async () => {
        
//         render(
//             <BrowserRouter>
//         <UserContext.Provider value={mockUser}>
//             <Admin></Admin>
//         </UserContext.Provider>
//         </BrowserRouter>
//         )
      
       
        
//       });
//     expect(screen.getByText(/Unauthorized/)).toBeInTheDocument()

// })

it('Shows the employee detail when the manager accesses', async () => {

    const mockManager = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}
    const mockEmployee = {
        userData: {
            first_name: 'Bud',
            last_name: 'Gormley',
            position_name: 'Employee',
            certification_name: 'None',
            employee_id: 25
        },
        timecardsData: [{
            timecard_date: '2023-01-01',
            job_id: '123b',
            job_name: 'Stadium',
            reg_time:8,
            overtime:0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ] }

    axios.get = jest.fn().mockResolvedValue({data : mockEmployee})
    await act(async () => {
        
        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
        <UserContext.Provider value={mockManager}>
            <EmployeeDetail></EmployeeDetail>
        </UserContext.Provider>
        </MemoryRouter>
        )
        
      });
    expect(screen.getByText(/Gormley/)).toBeInTheDocument()

})

it('Shows the appropriate jobs and employees when managers are preparing reports', async () => {

    const mockManager = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}
    const mockParams = {
        jobs: [{
            job_id: 'A1',
            job_name: 'Sewage'
        },
        {
            job_id: 'A2',
            job_name: 'Candy Store'
        }
    ],
        employees: [{
            employee_id: 25,
            first_name: 'Bud',
            last_name: 'Gormley'
        },
            {
                employee_id: 26,
                first_name: 'Tad',
                last_name: 'Gormley'

            }
        ] }

    axios.get = jest.fn().mockResolvedValue({data : mockParams})
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockManager}>
            <TimecardsFilterReportForm></TimecardsFilterReportForm>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/Candy/)).toBeInTheDocument();
    expect(screen.getByText(/Tad/)).toBeInTheDocument();

})


it('Shows the appropriate timecards report', async () => {

    const mockManager = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}

    const mockParams = {
        jobs: [{
            job_id: 'A1',
            job_name: 'Sewage'
        },
        {
            job_id: 'A2',
            job_name: 'Candy Store'
        }
    ],
        employees: [{
            employee_id: 25,
            first_name: 'Bud',
            last_name: 'Gormley'
        },
            {
                employee_id: 26,
                first_name: 'Tad',
                last_name: 'Gormley'

            }
        ] }

    const mockTimecards = {
        table: [{
            job_id: 'A1',
            job_name: 'Sewage',
            employee_id: 25,
            timecard_date: '2023-01-01',
            reg_time: 8,
            overtime: 0,
            expenses: 1.0,
            notes: 'Stubbed my toe'
        },
        {
            job_id: 'A1',
            job_name: 'Sewage',
            employee_id: 25,
            timecard_date: '2023-01-02',
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Toe is doing better'
        }
    ],
        summary: {
            totalReg: 16,
            totalOT: 0,
            totalExp: 1
        }  
         }

         let popPage = jest.fn(() => mockTimecards )
    
         axios.get = jest.fn().mockResolvedValueOnce({data : mockParams})

    // axios.get = jest.fn().mockResolvedValueOnce({data : mockTimecards})

  

  
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockManager}>
            <TimecardsFilterReportForm populatePage={popPage}>
      
            </TimecardsFilterReportForm>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/Candy/)).toBeInTheDocument();
    expect(screen.getByText(/Tad/)).toBeInTheDocument();

})