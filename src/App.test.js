import React from 'react';
import { render, fireEvent, screen, act } from "@testing-library/react";
import App from './App';
import axios from 'axios'

jest.mock('axios')

it('Shows the login box when rendered and no user is found', async () => {

    const mockNoUser = {data: {
        noUser: 'Cannot find'
    }}
    axios.get = jest.fn().mockResolvedValue(mockNoUser)
    await act(async () => {
        
        render(<App></App>)
      });
    expect(screen.getByText('Login')).toBeInTheDocument()

})

it('Shows the jobs list when rendered and valid user is found', async () => {

    const mockJobsList = []

    const mockUser = {data: {
        employeeId: res.data.employee_id,
            position: res.data.position,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            userNotFound: false,
            firstLogin: res.data.first_login
    }}
    axios.get = jest.fn().mockResolvedValue(mockUser)
    await act(async () => {
        
        render(<App></App>)
      });
    expect(screen.getByText('Login')).toBeInTheDocument()

})