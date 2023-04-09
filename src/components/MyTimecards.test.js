import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import MyTimecards from './MyTimecards';
import FourOhFour from './FourOhFour';
import Login from './Login';

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
        timecard_id:1,
        job_id:'a1',
        job_name: 'sewage plant',
        timecard_date: '2023-03-17',
        reg_time: 8,
        overtime:0,
        expenses: 0,
        notes: 'Cold'
    },
{
    timecard_id:2,
   job_id:'a2',
   job_name: 'skyscraper',
   timecard_date: '2023-03-18',
        reg_time: 8,
        overtime:0,
        expenses: 0,
        notes: null 
},{
    timecard_id:3,
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

it('My timecards form redirects to 404 on server error', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false  
    }
    axios.get = jest.fn().mockRejectedValue(new Error('error'))
    
    render(
        <MemoryRouter initialEntries={["/my-profile"]}>
            <UserContext.Provider value={mockUser}>
                <Routes>
                    <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                    <Route path="/my-profile" element={<MyTimecards></MyTimecards>}></Route>
                </Routes>
            </UserContext.Provider>
        </MemoryRouter>
    )
  
    await act(async () => {

        let fromDateInput = screen.getByTestId('myTimecardsFromDate');
        let toDateInput = screen.getByTestId('myTimecardsToDate');

        fireEvent.change(fromDateInput, {target: {value: '2023-03-15'}})
        fireEvent.change(toDateInput, {target: {value: '2023-03-20'}})
        
        let submitBtn = screen.getByTestId('myTimecardsReportSubmit');
        
        userEvent.click(submitBtn)
      

    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()
   

})

it('My timecards form redirects to login on null context user', async () => {

    const mockUser = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: false  
    }
    axios.get = jest.fn().mockRejectedValue(new Error('error'))
    
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/my-profile"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                        <Route path="/login" element={<Login></Login>}></Route>
                        <Route path="/my-profile" element={<MyTimecards></MyTimecards>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
      

    })
    expect(screen.getByText(/Login/)).toBeInTheDocument()
})