import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import MyTimecards from './MyTimecards';

jest.mock('axios')

it('My timecards form rejects invalid dates', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false  
    }
     
    render(
        <BrowserRouter>
             <UserContext.Provider value={mockUser}>
                    <MyTimecards></MyTimecards>
                </UserContext.Provider>
        </BrowserRouter>
    )
 
    await act(async () => {

        let fromDateInput = screen.getByTestId('myTimecardsFromDate');
        let toDateInput = screen.getByTestId('myTimecardsToDate');
        fireEvent.change(fromDateInput, {target: {value: '2023-03-15'}})
        fireEvent.change(toDateInput, {target: {value: '2023-03-14'}})
    
        // userEvent.selectOptions(fromDateInput, '2023-03-15');
        // userEvent.selectOptions(toDateInput, '2023-03-14');
        
        let submitBtn = screen.getByTestId('myTimecardsReportSubmit');
        
        userEvent.click(submitBtn)

    })
    expect(screen.getByText(/From date cannot be greater than to date./)).toBeInTheDocument()
    

})

it('My timecards form shows timecards for valid input', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false  
    }
    axios.get = jest.fn().mockResolvedValue({ data:{ table:[{
        job_id:'a1',
        job_name: 'sewage plant',
        timecard_date: '2023-03-17',
        reg_time: 8,
        overtime:0,
        expenses: 0,
        notes: 'Cold'
    },
{
   job_id:'a2',
   job_name: 'skyscraper',
   timecard_date: '2023-03-18',
        reg_time: 8,
        overtime:0,
        expenses: 0,
        notes: null 
},{
    job_id:'a3',
    job_name: 'ski hill',
    timecard_date: '2023-03-19',
        reg_time: 8,
        overtime:0,
        expenses: 0,
        notes: null 
 }

]} })
    
    render(
        <BrowserRouter>
             <UserContext.Provider value={mockUser}>
                    <MyTimecards></MyTimecards>
                </UserContext.Provider>
        </BrowserRouter>
    )
  
    await act(async () => {

        let fromDateInput = screen.getByTestId('myTimecardsFromDate');
        let toDateInput = screen.getByTestId('myTimecardsToDate');

        fireEvent.change(fromDateInput, {target: {value: '2023-03-15'}})
        fireEvent.change(toDateInput, {target: {value: '2023-03-20'}})
        
        let submitBtn = screen.getByTestId('myTimecardsReportSubmit');
        
        userEvent.click(submitBtn)
        await axios.get()

    })
    expect(screen.getByText(/ski hill/)).toBeInTheDocument()
   

})