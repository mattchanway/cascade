import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Admin from './Admin';

jest.mock('axios')



it('Shows the admin list when the manager accesses', async () => {

    const mockUser = {
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

it('Redirects to login when non manager accesses', async () => {

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        Navigate: jest.fn(),
        useNavigate: jest.fn(),
      }));

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Chud',
        lastName: 'Rost',
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
        })
        expect(useNavigate).toHaveBeenCalledWith({to: '/unauthorized', replace:true})
    

})