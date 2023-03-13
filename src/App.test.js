import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import App from './App';
import axios from 'axios'
import Jobs from './components/Jobs'
import UserContext from './components/UserContext';
import { BrowserRouter } from 'react-router-dom';
import Admin from './components/Admin';

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

    const mockJobsList = [{job_id: '1', job_name: 'Fake 1', 
    job_address_street_line1: '123 Fake St', job_address_street_unit:'#5', job_address_street_city: 'Surrey'},
    {job_id: '2', job_name: 'Fake 2', 
    job_address_street_line1: '456 Fake St', job_address_street_unit:'#6', job_address_street_city: 'Surrey'},
    {job_id: '3', job_name: 'Fake 3', 
    job_address_street_line1: '789 Fake St', job_address_street_unit:'#10', job_address_street_city: 'Vancouver'}]

    const mockUser = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}


    axios.get = jest.fn().mockResolvedValue({data : mockJobsList})
    await act(async () => {
        
        render(
            <BrowserRouter>
        <UserContext.Provider value={mockUser}>
            <Jobs></Jobs>
        </UserContext.Provider>
        </BrowserRouter>
        )
        
      });
    expect(screen.getByText(/789 Fake St #10 Vancouver/)).toBeInTheDocument()

})

it('Shows the admin list when the manager accesses', async () => {

    const mockUser = {data: {
        employeeId: 1,
            position: 3,
            firstName: 'Shawn',
            lastName: 'Rostas',
            userNotFound: false,
            firstLogin: false
    }}


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