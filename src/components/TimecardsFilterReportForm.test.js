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

jest.mock('axios')

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
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockParams })
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


it('Shows the appropriate timecards report results', async () => {
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
        ]
    }

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

    axios.get.mockImplementation((url) => {
        switch (url) {
            case `${baseURL}/timecards/filter`:
                return Promise.resolve({ data: mockTimecards })
            case `${baseURL}/timecards/form-populate`:
                return Promise.resolve({ data: mockParams })
        }
    }
    )
 
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
            <MemoryRouter initialEntries={["/report"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/report" element={<TimecardsFilterReportForm></TimecardsFilterReportForm>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
   
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument();

})

it('redirects to unauthorized if user is not manager', async () => {

    const mockManager = {
        employeeId: 1,
        position: 1,
        firstName: 'Gome',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    axios.get = jest.fn().mockResolvedValue(new Error('err'))
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/report"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/report" element={<TimecardsFilterReportForm></TimecardsFilterReportForm>}></Route>
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
            <MemoryRouter initialEntries={["/report"]}>
                <UserContext.Provider value={mockManager}>
             
                    <Routes>
                        <Route path="/report" element={<TimecardsFilterReportForm></TimecardsFilterReportForm>}></Route>
                        <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                        <Route path="/Login" element={<Login></Login>}></Route>
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
        ]
    }

    axios.get = jest.fn().mockResolvedValueOnce({data: mockParams})

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/report"]}>
                    <UserContext.Provider value={mockManager}>
                 
                        <Routes>
                            <Route path="/report" element={<TimecardsFilterReportForm></TimecardsFilterReportForm>}></Route>
                            <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                            <Route path="/Login" element={<Login></Login>}></Route>
                        </Routes>
                    </UserContext.Provider>
                </MemoryRouter>
        )
    });

    axios.get = jest.fn().mockRejectedValueOnce(new Error('error'))
    await act(async () => {
     
        let submitBtn = screen.getByTestId('reportSubmit')
        userEvent.click(submitBtn)


    });

    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument();

})