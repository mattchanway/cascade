import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import TimecardsFilterReportForm from './TimecardsFilterReportForm';
import baseURL from '../helpers/constants';
import userEvent from '@testing-library/user-event';
import FourOhFour from './FourOhFour';
import Unauthorized from './Unauthorized';
import Login from './Login';
import SummaryReport from './SummaryReport';

jest.mock('axios')

it('Shows the appropriate employees to potentially omit', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockParams = 
        [{employee_id: 1, first_name: 'Tad', last_name:'Smith', included:true},{employee_id: 2, first_name: 'Jeff', last_name:'Jones', included:true}]
    

    axios.get = jest.fn().mockResolvedValue({ data: mockParams })
    await act(async () => {

        render(
            <BrowserRouter>
                <UserContext.Provider value={mockManager}>
                    <SummaryReport></SummaryReport>
                </UserContext.Provider>
            </BrowserRouter>
        )

        
    });

    await act(async () => {
        let btn = screen.getByTestId('forEmployeesDropdown')
        userEvent.click(btn)

    })


    expect(screen.getByText(/Smith/)).toBeInTheDocument();
    expect(screen.getByText(/Jones/)).toBeInTheDocument();

})


it('Shows the appropriate timecards report results', async () => {
    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    const mockParams = 
        [{employee_id: 1, first_name: 'Tad', last_name:'Smith', included:true},{employee_id: 2, first_name: 'Jeff', last_name:'Jones', included:true}]

   

    const mockReport = [{job_id:1,job_name:'Fruit Store', reg_time_total: 24, overtime_total: 8, expenses_total: 52.50},
    {job_id:2,job_name:'Vegetable Store', reg_time_total: 32, overtime_total: 11, expenses_total: 22.43},
    {job_id:3,job_name:'Video Store', reg_time_total: 45, overtime_total: 3, expenses_total: 0}
]
       
    

    axios.get.mockImplementation((url) => {
        switch (url) {
            case `${baseURL}/employees`:
                return Promise.resolve({ data: mockParams })
            case `${baseURL}/timecards/reports/job-summary`:
                return Promise.resolve({ data: mockReport })
        }
    }
    )

   
 
    render(
        <BrowserRouter>
            <UserContext.Provider value={mockManager}>
                <SummaryReport>

                </SummaryReport>
            </UserContext.Provider>
        </BrowserRouter>
    )


    await act(async () => {
        axios.get(`${baseURL}/timecards/filter`)
        let submitBtn = screen.getByTestId('summaryReportSubmit')
        userEvent.click(submitBtn)


    });

    expect(screen.getByText(/Fruit Store/)).toBeInTheDocument();
    expect(screen.getByText(/Vegetable Store/)).toBeInTheDocument();
    expect(screen.getByText(/Video Store/)).toBeInTheDocument();
    expect(screen.getByText(/22.43/)).toBeInTheDocument();

})

it('throws error if jobs/employees do not load from server', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }


    axios.get = jest.fn().mockResolvedValue(new Error('err'))
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/reports/job-summary"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/reports/job-summary" element={<SummaryReport></SummaryReport>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
   
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument();

})

it('redirects to unauthorized if user is not manager', async () => {

    const mockNonManager = {
        employeeId: 1,
        position: 1,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }


    axios.get = jest.fn().mockResolvedValue(new Error('err'))
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/reports/job-summary"]}>
                <UserContext.Provider value={mockNonManager}>
             
                    <Routes>
                        <Route path="/reports/job-summary" element={<SummaryReport></SummaryReport>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                        <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
   

    expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument();
})

it('redirects to login if user is null', async () => {

    const mockManager = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: false
    }
   
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/reports/job-summary"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/reports/job-summary" element={<SummaryReport></SummaryReport>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                        <Route path="/login" element={<Login></Login>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Login/)).toBeInTheDocument();
})

it('Redirects to 404 if form submission throws', async () => {
    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    const mockParams = 
    [{employee_id: 1, first_name: 'Tad', last_name:'Smith', included:true},{employee_id: 2, first_name: 'Jeff', last_name:'Jones', included:true}]

    axios.get = jest.fn().mockResolvedValueOnce({data: mockParams})

    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/reports/job-summary"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/reports/job-summary" element={<SummaryReport></SummaryReport>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                        <Route path="/login" element={<Login></Login>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });



    axios.get = jest.fn().mockRejectedValueOnce(new Error('error'))
    await act(async () => {
     
        let submitBtn = screen.getByTestId('summaryReportSubmit')
        userEvent.click(submitBtn)


    });

    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument();

})