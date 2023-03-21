import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import Navibar from './Navbar';

jest.mock('axios')

it('Shows the admin navbar when the manager accesses', async () => {

    const mockUser = {
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

    const mockUser = {
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