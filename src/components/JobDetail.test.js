import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import JobDetail from './JobDetail';

jest.mock('axios')




it('Shows the job detail when the employee accesses and allows timecard creation', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false
    }
    const mockJob = {
        job_id: '123abc',
        job_name: 'Sewage Plant',
        job_address_street_line1: '69 Sewage St',
        job_address_street_unit: '#69',
        job_address_street_city: 'Sewerland',
        job_description: 'Clean up'
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockJob })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
                <UserContext.Provider value={mockUser}>
                    <JobDetail></JobDetail>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

    expect(screen.getByText(/69 Sewage St/)).toBeInTheDocument();

    await act(async () => {

        let showTimecardBtn = screen.getByTestId('showAddTimecardForm');
        userEvent.click(showTimecardBtn);
    });

    expect(screen.getByText(/Reg Time/)).toBeInTheDocument();
    expect(screen.getByText(/New Timecard: Sewage Plant 123abc/)).toBeInTheDocument();

    axios.get.mockImplementation(() => {

        return Promise.resolve({ data: { timecard_id: 1 } })

    }
    )


    await act(async () => {

        let regTimeInput = screen.getByTestId('regTimeInput');
        let overtimeInput = screen.getByTestId('overtimeInput');
        let expensesInput = screen.getByTestId('expensesInput');
        let notesInput = screen.getByTestId('notesInput');
        let submitBtn = screen.getByTestId('submitTimecardButton');
        userEvent.type(regTimeInput, '{backspace}');
        userEvent.type(regTimeInput, '8');
      
        expect(regTimeInput.value).toBe('8');
       
        userEvent.click(submitBtn);
        await axios.get()
    });

    expect(screen.getByText(/Timecard added!/)).toBeInTheDocument()

})