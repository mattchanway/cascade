import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import App from '../App';
import axios from 'axios'

jest.mock('axios')

it('Shows the login box when rendered and no user is found', async () => {

    const mockNoUser = {
        data: {
            noUser: 'Cannot find'
        }
    }
    axios.get = jest.fn().mockResolvedValue(mockNoUser)
    await act(async () => {

        render(<App></App>)
    });
    expect(screen.getByTestId('loginForm')).toBeInTheDocument()

})