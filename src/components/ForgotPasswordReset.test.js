import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ForgotPasswordReset from './ForgotPasswordReset';
import FourOhFour from './FourOhFour'
import Jobs from './Jobs';


jest.mock('axios')

it('Password reset token submit form correctly validates new password', async () => {

    render(
        <BrowserRouter>
            <ForgotPasswordReset></ForgotPasswordReset>
        </BrowserRouter>
    )
    // axios.post = jest.fn().mockResolvedValue({ data: { passwordToken: '123', email: 'matthewchanway@gmail.com' } })
    let password = screen.getByTestId('ForgotPasswordResetPassword');
    let confirm = screen.getByTestId('ForgotPasswordResetPasswordConfirm');
    let submit = screen.getByTestId("ForgotPasswordResetPasswordSubmit");

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

it('Password reset token submit form correctly rejects invalid token', async () => {

    render(
        <MemoryRouter>
            <ForgotPasswordReset></ForgotPasswordReset>
        </MemoryRouter>
    )
    axios.post = jest.fn().mockResolvedValue({ data: { invalidToken: 'Invalid token' } })
    let password = screen.getByTestId('ForgotPasswordResetPassword');
    let confirm = screen.getByTestId('ForgotPasswordResetPasswordConfirm');
    let submit = screen.getByTestId("ForgotPasswordResetPasswordSubmit");
    await act(async () => {

        userEvent.type(password, 'kekkekkek');
        userEvent.type(confirm, 'kekkekkek');
        expect(password.value).toBe('kekkekkek');
        userEvent.click(submit);
        await axios.post()

    })
    expect(screen.getByText(/Invalid request. Ensure you are submitting the password reset request within 10 minutes./)).toBeInTheDocument()

})

it('Password reset token submit form correctly reacts to server error', async () => {

    render(
        <MemoryRouter initialEntries={["/reset-password/abc123"]}>
            <Routes>
                <Route>
                <Route path="/reset-password/:token" element={<ForgotPasswordReset></ForgotPasswordReset>} ></Route>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>

                </Route>
            </Routes>
           
        </MemoryRouter>
    )
    axios.post = jest.fn().mockRejectedValue(new Error('error'));
   
    let password = screen.getByTestId('ForgotPasswordResetPassword');
    let confirm = screen.getByTestId('ForgotPasswordResetPasswordConfirm');
    let submit = screen.getByTestId("ForgotPasswordResetPasswordSubmit");

    await act(async () => {

        userEvent.type(password, 'kekkekkek');
        userEvent.type(confirm, 'kekkekkek');
        expect(password.value).toBe('kekkekkek');
        userEvent.click(submit);
    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})

it('Password reset token submit form correctly handles valid password and token', async () => {

    render(
        <MemoryRouter initialEntries={["/reset-password/abc123"]}>
            <Routes>
                <Route>
                <Route path="/reset-password/:token" element={<ForgotPasswordReset></ForgotPasswordReset>} ></Route>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                <Route path="/" element={<Jobs></Jobs>}></Route>
                </Route>
            </Routes>
           
        </MemoryRouter>
    )
    axios.post = jest.fn().mockResolvedValue({data:{
        employee_id: 1,
            position: 3,
            first_name: 'Shawn',
            last_name: 'Rostas',
            first_login: false
    }});
   
    let password = screen.getByTestId('ForgotPasswordResetPassword');
    let confirm = screen.getByTestId('ForgotPasswordResetPasswordConfirm');
    let submit = screen.getByTestId("ForgotPasswordResetPasswordSubmit");

    await act(async () => {

        userEvent.type(password, 'kekkekkek');
        userEvent.type(confirm, 'kekkekkek');
        expect(password.value).toBe('kekkekkek');
        userEvent.click(submit);
    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})

