import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import FourOhFour from './FourOhFour';
import axios from 'axios'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ForgotPasswordModalForm from './ForgotPasswordModalForm';
import Jobs from './Jobs';

jest.mock('axios')

it('Forgot Password form returns an error if user is not found', async () => {


    render(
        <BrowserRouter>
            <ForgotPasswordModalForm></ForgotPasswordModalForm>
        </BrowserRouter>
    )
    axios.post = jest.fn().mockResolvedValue({ data: { userNotFound: 'no user' } })
    let input = screen.getByTestId("forgotPasswordModalFormEmployeeId");
    let submit = screen.getByTestId("forgotPasswordModalFormSubmit");
    await act(async () => {

        userEvent.type(input, '22');
        expect(input.value).toBe('22');
        userEvent.click(submit);
        await axios.post()

    })
    expect(screen.getByText(/No user exists/)).toBeInTheDocument()


})

it('Forgot Password form shows further instructions if user is found', async () => {

    render(
        <BrowserRouter>
            <ForgotPasswordModalForm></ForgotPasswordModalForm>
        </BrowserRouter>
    )
    axios.post = jest.fn().mockResolvedValue({ data: { passwordToken: '123', email: 'matthewchanway@gmail.com' } })
    let input = screen.getByTestId("forgotPasswordModalFormEmployeeId");
    let submit = screen.getByTestId("forgotPasswordModalFormSubmit");
    await act(async () => {

        userEvent.type(input, '22');
        expect(input.value).toBe('22');
        userEvent.click(submit);
        await axios.post()

    })
    expect(screen.getByText(/A link to reset your password has been sent/)).toBeInTheDocument()
})

it('Shows server error when API throws', async () => {

    render(
        <MemoryRouter initialEntries={["/accounts/password/reset"]}>
             <Routes>
                    <Route path="/accounts/password/reset" element={<ForgotPasswordModalForm></ForgotPasswordModalForm>} ></Route>
                    <Route path ="/404" element={<FourOhFour></FourOhFour>}></Route>
                    
                    </Routes>
        </MemoryRouter>
    )
    axios.post = jest.fn().mockResolvedValue(new Error('err'))
    // axios.mockRejectedValue(new Error('err'))
    let input = screen.getByTestId("forgotPasswordModalFormEmployeeId");
    let submit = screen.getByTestId("forgotPasswordModalFormSubmit");
    await act(async () => {

        userEvent.type(input, '22');
        expect(input.value).toBe('22');
        userEvent.click(submit);
    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()
})