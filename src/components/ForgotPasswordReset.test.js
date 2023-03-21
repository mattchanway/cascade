import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ForgotPasswordReset from './ForgotPasswordReset';

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
        <BrowserRouter>
            <ForgotPasswordReset></ForgotPasswordReset>
        </BrowserRouter>
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