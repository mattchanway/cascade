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
import baseURL from './helpers/constants';
import userEvent from '@testing-library/user-event';
import Navibar from './components/Navbar';
import JobDetail from './components/JobDetail';

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

    const mockUser = {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }


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

    const mockUser =  {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }
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

    const mockManager = {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }
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

    const mockManager = {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }
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
    const mockManager = {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }

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

         axios.get.mockImplementation((url) =>{
            switch(url){
                case `${baseURL}/timecards/filter`:
                    return Promise.resolve({data: mockTimecards})
                case `${baseURL}/timecards/form-populate`:
                    return Promise.resolve({data: mockParams})
            }
         }
         )
    axios.get(`${baseURL}/timecards/form-populate`)
   
    
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockManager}>
            <TimecardsFilterReportForm>
      
            </TimecardsFilterReportForm>
        </UserContext.Provider>
        </BrowserRouter>
        ) 
    
   
    await act(async () => {
        axios.get(`${baseURL}/timecards/filter`)
        let submitBtn = screen.getByTestId('reportSubmit')
        userEvent.click(submitBtn)
       
    
      });
      
    expect(screen.getByText(/Candy/)).toBeInTheDocument();
    expect(screen.getByText(/Tad/)).toBeInTheDocument();
    expect(screen.getByText(/Toe/)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01/)).toBeInTheDocument();

})

it('Shows the admin navbar when the manager accesses', async () => {

    const mockUser =  {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockUser}>
           <Navibar></Navibar>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/Report/)).toBeInTheDocument();
    expect(screen.getByText(/Employees/)).toBeInTheDocument();

})

it('Shows the employee navbar when the employee accesses', async () => {

    const mockUser =  {
        employeeId: 1,
            position: 1,
            firstName: 'Bub',
            lastName: 'Jones',
            userNotFound: false,
            firstLogin: false
    }
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockUser}>
           <Navibar></Navibar>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
      expect(screen.queryByText(/Report/)).toBeNull()
    expect(screen.queryByText(/Employees/)).toBeNull()
    expect(screen.getByText(/All Jobs/)).toBeInTheDocument();
})

it('Shows the job detail when the employee accesses', async () => {

    const mockUser = {
        employeeId: 1,
            position: 1,
            firstName: 'Bud',
            lastName: 'Gomley',
            userNotFound: false,
            firstLogin: false
    }
    const mockJob = {
            job_id: '123abc',
            job_name: 'Sewage Plant',
            job_address_street_line1: '69 Sewage St',
            job_address_street_unit: '#69',
            job_address_street_city: 'Sewerland',
            job_description: 'Clean up'
       }

    axios.get = jest.fn().mockResolvedValue({data : mockJob})
    await act(async () => {
        
        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
        <UserContext.Provider value={mockUser}>
            <JobDetail></JobDetail>
        </UserContext.Provider>
        </MemoryRouter>
        )
      });

    expect(screen.getByText(/69 Sewage St/)).toBeInTheDocument();
    const user = userEvent.setup()
    await act(async () => {

        let showTimecardBtn = screen.getByTestId('showAddTimecardForm');
        userEvent.click(showTimecardBtn);
      });

      expect(screen.getByText(/Reg Time/)).toBeInTheDocument();
      expect(screen.getByText(/New Timecard: Sewage Plant 123abc/)).toBeInTheDocument();

      await act(async () => {

        let regTimeInput = screen.getByTestId('regTimeInput');
        let overtimeInput = screen.getByTestId('overtimeInput');
        let expensesInput = screen.getByTestId('expensesInput');
        let submitBtn = screen.getByTestId('submitTimecardButton');
        console.log(regTimeInput.value)
         await user.type(regTimeInput, 8);
         console.log('again',regTimeInput.value)
     await user.type(overtimeInput, 0);
        await user.type(expensesInput, 0);
        await user.click(submitBtn);
      });

      expect(screen.getByText(/Timecard added for Sewage Plant/)).toBeInTheDocument()
      
})