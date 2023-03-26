import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Navibar from './Navbar';
import MyTimecards from './MyTimecards';
import userEvent from '@testing-library/user-event';

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

it('Does not show routes to null user', async () => {

    const mockUser = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
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
    expect(screen.queryByText(/All Jobs/)).toBeNull();
    expect(screen.queryByText(/Login/)).not.toBeNull();
})

it('Logout functionality works', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bub',
        lastName: 'Jones',
        userNotFound: false,
        firstLogin: false
    }

    let mockSetLoggedInUser = jest.fn().mockReturnValue({employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true})

    await act(async () => {

        render(
<MemoryRouter initialEntries={["/my-profile"]}>
<UserContext.Provider value={mockUser}>
    <Navibar setLoggedInUser={mockSetLoggedInUser}></Navibar>
    <Routes>    
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/my-profile" element={<MyTimecards></MyTimecards>}></Route>
    </Routes>
</UserContext.Provider>
</MemoryRouter>
        )

    });
    expect(screen.getByText(/All Jobs/)).toBeInTheDocument();

    

    let logoutBtn = screen.getByTestId("logout-test-btn");

    await act(async () => {

        userEvent.click(logoutBtn)
    })

    expect(mockSetLoggedInUser).toHaveBeenCalled();
   
})