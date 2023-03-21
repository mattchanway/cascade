import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import EmployeeDetail from './EmployeeDetail';

jest.mock('axios')

it('Shows the employee detail when the manager accesses', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockEmployee = {
        userData: {
            first_name: 'Bud',
            last_name: 'Gormley',
            position_name: 'Employee',
            certification_name: 'None',
            employee_id: 25
        },
        timecardsData: [{
            timecard_date: '2023-01-01',
            job_id: '123b',
            job_name: 'Stadium',
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Some notes here',
            time_submitted: 'Would go here'
        }
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockEmployee })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/employees/25"]}>
                <UserContext.Provider value={mockManager}>
                    <EmployeeDetail></EmployeeDetail>
                </UserContext.Provider>
            </MemoryRouter>
        )

    });
    expect(screen.getByText(/Gormley/)).toBeInTheDocument()

})