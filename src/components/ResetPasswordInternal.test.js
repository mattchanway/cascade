import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPasswordInternal from './ResetPasswordInternal';
import Login from './Login';
import Unauthorized from './Unauthorized';
import FourOhFour from './FourOhFour';
import userEvent from '@testing-library/user-event';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

jest.mock('axios')

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: ()=> mockedUseNavigate

}))


it('Password reset token submit form correctly validates new password', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    render(
        <UserContext.Provider value={mockManager}>
        <BrowserRouter>
            <ResetPasswordInternal></ResetPasswordInternal>
        </BrowserRouter>
        </UserContext.Provider>
    )
    // axios.post = jest.fn().mockResolvedValue({ data: { passwordToken: '123', email: 'matthewchanway@gmail.com' } })
    let password = screen.getByTestId("reset-pw-input");
    let confirm = screen.getByTestId("reset-confirm-input");
    let submit = screen.getByTestId("reset-pw-submit");

    await act(async () => {

        userEvent.type(password, 'kek');
        userEvent.type(confirm, 'kek');
        expect(password.value).toBe('kek');
        userEvent.click(submit);
        // await axios.post()

    })
    expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument()

    await act(async () => {

        userEvent.type(password, 'kek');
        userEvent.type(confirm, 'kek2');
        expect(password.value).toBe('kekkek');
        userEvent.click(submit);
        // await axios.post()

    })
    expect(screen.getByText(/Passwords do not match./)).toBeInTheDocument()

})

it('Internal password reset handles valid passwords', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    let mockSetLoggedInUser = jest.fn()

    render(
        <UserContext.Provider value={mockManager}>
        <BrowserRouter>
            <ResetPasswordInternal setLoggedInUser={mockSetLoggedInUser}></ResetPasswordInternal>
        </BrowserRouter>
        </UserContext.Provider>
    )
    axios.patch = jest.fn().mockResolvedValue({ data: { a:true } })
    let password = screen.getByTestId("reset-pw-input");
    let confirm = screen.getByTestId("reset-confirm-input");
    let submit = screen.getByTestId("reset-pw-submit");

    await act(async () => {

        userEvent.type(password, 'kekkek12');
        userEvent.type(confirm, 'kekkek12'); 
    })
    expect(password.value).toBe('kekkek12');

    await act(async () => {  
        userEvent.click(submit);
    })
    expect(mockedUseNavigate).toHaveBeenCalled()

})

it('Redirects to 404 if patch throws', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    render(
        <MemoryRouter initialEntries={["/admin/password"]}>
        <UserContext.Provider value={mockManager}>
        <Routes>
            <Route path="/admin/password" element={<ResetPasswordInternal></ResetPasswordInternal>} ></Route>
            <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
            </Routes>
        </UserContext.Provider>
        </MemoryRouter>
    )
    axios.patch = jest.fn().mockRejectedValue(new Error('err'))
    let password = screen.getByTestId("reset-pw-input");
    let confirm = screen.getByTestId("reset-confirm-input");
    let submit = screen.getByTestId("reset-pw-submit");

    await act(async () => {

        userEvent.type(password, 'kekkek12');
        userEvent.type(confirm, 'kekkek12'); 
    })
    expect(password.value).toBe('kekkek12');

    await act(async () => {  
        userEvent.click(submit);
    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})

it('Redirects to login for null user', async () => {

    const mockManager = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: false
    }

    render(
        <MemoryRouter initialEntries={["/admin/password"]}>
        <UserContext.Provider value={mockManager}>
        <Routes>
            <Route path="/admin/password" element={<ResetPasswordInternal></ResetPasswordInternal>} ></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            </Routes>
        </UserContext.Provider>
        </MemoryRouter>
    )
   
    expect(screen.getByText(/Login/)).toBeInTheDocument()

})













