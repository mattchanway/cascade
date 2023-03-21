import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";

import axios from 'axios'
import Jobs from './Jobs'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

jest.mock('axios')


it('Shows the jobs list when rendered and valid user is found', async () => {

    const mockJobsList = [{
        job_id: '1', job_name: 'Fake 1',
        job_address_street_line1: '123 Fake St', job_address_street_unit: '#5', job_address_street_city: 'Surrey'
    },
    {
        job_id: '2', job_name: 'Fake 2',
        job_address_street_line1: '456 Fake St', job_address_street_unit: '#6', job_address_street_city: 'Surrey'
    },
    {
        job_id: '3', job_name: 'Fake 3',
        job_address_street_line1: '789 Fake St', job_address_street_unit: '#10', job_address_street_city: 'Vancouver'
    }]

    const mockUser = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }


    axios.get = jest.fn().mockResolvedValue({ data: mockJobsList })
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