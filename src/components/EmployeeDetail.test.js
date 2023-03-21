import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import EmployeeDetail from './EmployeeDetail';
import Login from './Login';
import Unauthorized from './Unauthorized';
import FourOhFour from './FourOhFour';

jest.mock('axios')

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
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Gormley/)).toBeInTheDocument()

})

it('Shows the employee detail when non-manager-self accesses', async () => {

    const mockUser = {
        employeeId: 25,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gormley',
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
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                    <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
          
    });
    expect(screen.getByText(/Gormley/)).toBeInTheDocument()

})



it('Redirects to login if not logged in', async () => {

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
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

    let nullUser= {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: null,
        passwordReset: false
      }

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={nullUser}>
                    <Routes>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>

                    </Routes>
                  
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Login/)).toBeInTheDocument()

})

it('Redirects to unauthorized if non-manager access employee that is not self', async () => {

    const mockNonManager = {
        employeeId: 24,
        position: 1,
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
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={mockNonManager}>
                    <Routes>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
                    <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>

                    </Routes>
                  
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument()



})

it('Redirects to 404 on server error', async () => {

    const mockNonManager = {
        employeeId: 25,
        position: 1,
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
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

   
    axios.mockRejectedValue(new Error('err'))
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={mockNonManager}>
                    <Routes>
                    <Route path="/employees/:id" element={<EmployeeDetail></EmployeeDetail>} ></Route>
                    <Route path ="/404" element={<FourOhFour></FourOhFour>}></Route>
                    <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>

                    </Routes>
                  
                </UserContext.Provider>
            </MemoryRouter>
        )
        await axios.get()

    });
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})