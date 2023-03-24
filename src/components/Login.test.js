import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import Login from './Login';
import axios from 'axios'
import Jobs from './Jobs'
import FourOhFour from './FourOhFour';
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes,Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('axios')

const mockedUseNavigate = jest.fn();



jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: ()=> mockedUseNavigate

}))


it('Shows appropriate message upon failed login', async () => {

    const mockUser = {
        employeeId: null,
          position: null,
          firstName: null,
          lastName: null,
          userNotFound: true,
          firstLogin: null
    }
    axios.post = jest.fn().mockResolvedValue(false)
    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                <Route path="/" element={<Jobs></Jobs>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

    let loginBtn = screen.getByTestId("init-login-btn");

    await act(async () => {
        userEvent.click(loginBtn);
        
    });
    expect(screen.getByText(/Incorrect password or user not found./)).toBeInTheDocument()

})

it('Redirects to jobs on login', async () => {

    const mockUser = {
        employeeId: null,
          position: null,
          firstName: null,
          lastName: null,
          userNotFound: true,
          firstLogin: null
    }
    axios.post = jest.fn().mockResolvedValue({data:{
            employee_id:1,
            position:1,
            first_name:'Gorman',
            last_name: 'Chud',
            userNotFound: false,
            first_login: false
    }})

   let mockSetLoggedInUser = jest.fn()
    
    mockSetLoggedInUser.mockReturnValue({
        employeeId: 1,
        position: 1,
        firstName: 'Gorman',
        lastName: 'Chud',
        userNotFound: false,
        firstLogin: false  
    })

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                <Route path="/login" element={<Login setLoggedInUser = {mockSetLoggedInUser}></Login>}></Route>
                </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

    let loginBtn = screen.getByTestId("init-login-btn");

    await act(async () => {
        userEvent.click(loginBtn);
        
    });
    expect(mockedUseNavigate).toHaveBeenCalled();

})

it('Redirects to 404 on server error', async () => {

    const mockUser = {
        employeeId: null,
          position: null,
          firstName: null,
          lastName: null,
          userNotFound: true,
          firstLogin: null
    }
    axios.post = jest.fn().mockRejectedValue(new Error('error'))

    let mockSetLoggedInUser = jest.fn()

    mockSetLoggedInUser.mockReturnValue({
        employeeId: 1,
        position: 1,
        firstName: 'Gorman',
        lastName: 'Chud',
        userNotFound: false,
        firstLogin: false  
    })

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                <Route path="/login" element={<Login setLoggedInUser = {mockSetLoggedInUser}></Login>}></Route>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

    let loginBtn = screen.getByTestId("init-login-btn");

    await act(async () => {
        userEvent.click(loginBtn);
        
    });
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})