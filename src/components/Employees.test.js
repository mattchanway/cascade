import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Employees from './Employees';
import Login from './Login';
import Unauthorized from './Unauthorized';
import FourOhFour from './FourOhFour';

jest.mock('axios')

it('Shows the employee directory when the manager accesses', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockEmployees = 
        [{
            first_name: 'Bud',
            last_name: 'Gormley',
            employee_id: 25 
    },
    {first_name: 'Tad',
    last_name: 'Gormley',
    employee_id: 26 }
]
    
    axios.get = jest.fn().mockResolvedValue({ data: mockEmployees })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/employees" element={<Employees></Employees>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Gormley, Tad/)).toBeInTheDocument()
    expect(screen.getByText(/Gormley, Bud/)).toBeInTheDocument()
})

it('Shows unauthorized when non-manager attempts', async () => {

    const mockNonManager = {
        employeeId: 11,
        position: 1,
        firstName: 'Gome',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockEmployees = 
        [{
            first_name: 'Bud',
            last_name: 'Gormley',
            employee_id: 25 
    },
    {first_name: 'Tad',
    last_name: 'Gormley',
    employee_id: 26 }
]

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployees })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees"]}>
                <UserContext.Provider value={mockNonManager}>
                <Routes>
                    <Route path="/employees" element={<Employees></Employees>} ></Route>
                    <Route path="/unauthorized" element={<Unauthorized></Unauthorized>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument()

})

it('Shows 404 on server error', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockEmployees = 
        [{
            first_name: 'Bud',
            last_name: 'Gormley',
            employee_id: 25 
    },
    {first_name: 'Tad',
    last_name: 'Gormley',
    employee_id: 26 }
]
    
    axios.get = jest.fn().mockRejectedValue(new Error('err'))
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/employees" element={<Employees></Employees>} ></Route>
                    <Route path ="/404" element={<FourOhFour></FourOhFour>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()
    
})



