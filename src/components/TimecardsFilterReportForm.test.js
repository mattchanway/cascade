import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import TimecardsFilterReportForm from './TimecardsFilterReportForm';
import baseURL from '../helpers/constants';
import userEvent from '@testing-library/user-event';

jest.mock('axios')

it('Shows the appropriate jobs and employees when managers are preparing reports', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockParams = {
        jobs: [{
            job_id: 'A1',
            job_name: 'Sewage'
        },
        {
            job_id: 'A2',
            job_name: 'Candy Store'
        }
        ],
        employees: [{
            employee_id: 25,
            first_name: 'Bud',
            last_name: 'Gormley'
        },
        {
            employee_id: 26,
            first_name: 'Tad',
            last_name: 'Gormley'

        }
        ]
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockParams })
    await act(async () => {

        render(
            <BrowserRouter>
                <UserContext.Provider value={mockManager}>
                    <TimecardsFilterReportForm></TimecardsFilterReportForm>
                </UserContext.Provider>
            </BrowserRouter>
        )

    });
    expect(screen.getByText(/Candy/)).toBeInTheDocument();
    expect(screen.getByText(/Tad/)).toBeInTheDocument();

})


it('Shows the appropriate timecards report', async () => {
    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    const mockParams = {
        jobs: [{
            job_id: 'A1',
            job_name: 'Sewage'
        },
        {
            job_id: 'A2',
            job_name: 'Candy Store'
        }
        ],
        employees: [{
            employee_id: 25,
            first_name: 'Bud',
            last_name: 'Gormley'
        },
        {
            employee_id: 26,
            first_name: 'Tad',
            last_name: 'Gormley'

        }
        ]
    }

    const mockTimecards = {
        table: [{
            job_id: 'A1',
            job_name: 'Sewage',
            employee_id: 25,
            timecard_date: '2023-01-01',
            reg_time: 8,
            overtime: 0,
            expenses: 1.0,
            notes: 'Stubbed my toe'
        },
        {
            job_id: 'A1',
            job_name: 'Sewage',
            employee_id: 25,
            timecard_date: '2023-01-02',
            reg_time: 8,
            overtime: 0,
            expenses: 0,
            notes: 'Toe is doing better'
        }
        ],
        summary: {
            totalReg: 16,
            totalOT: 0,
            totalExp: 1
        }
    }

    axios.get.mockImplementation((url) => {
        switch (url) {
            case `${baseURL}/timecards/filter`:
                return Promise.resolve({ data: mockTimecards })
            case `${baseURL}/timecards/form-populate`:
                return Promise.resolve({ data: mockParams })
        }
    }
    )
    axios.get(`${baseURL}/timecards/form-populate`)



    render(
        <BrowserRouter>
            <UserContext.Provider value={mockManager}>
                <TimecardsFilterReportForm>

                </TimecardsFilterReportForm>
            </UserContext.Provider>
        </BrowserRouter>
    )


    await act(async () => {
        axios.get(`${baseURL}/timecards/filter`)
        let submitBtn = screen.getByTestId('reportSubmit')
        userEvent.click(submitBtn)


    });

    expect(screen.getByText(/Candy/)).toBeInTheDocument();
    expect(screen.getByText(/Tad/)).toBeInTheDocument();
    expect(screen.getByText(/Toe/)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01/)).toBeInTheDocument();

})