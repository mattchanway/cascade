import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import MultiSiteTimecardForm from './MultiSiteTimecardForm';

jest.mock('axios')

it('Multisite timecard allows three valid timecards', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false

        
    }
    axios.get = jest.fn().mockResolvedValue({ data: [{
        job_id:'a1',
        job_name: 'sewage plant'
    },
{
   job_id:'a2',
   job_name: 'skyscraper' 
},{
    job_id:'a3',
    job_name: 'ski hill' 
 }

] })
    
    

    render(
        <BrowserRouter>
             <UserContext.Provider value={mockUser}>
                    <MultiSiteTimecardForm></MultiSiteTimecardForm>
                </UserContext.Provider>
        </BrowserRouter>
    )
    await act(async()=>{

        await axios.get()
        let addRowBtn = screen.getByTestId("AddMultiTimecardButton");
        userEvent.click(addRowBtn)

    })


let arr = screen.getAllByText(/a3 - ski hill/)
expect(arr[0].value).toBe('a3')

axios.post = jest.fn().mockResolvedValue({ data: [{1: 'good'}, {2: 'good'}, {3:'good'}] })

    await act(async () => {

        let firstJobInput = screen.getByTestId("jobSite-1");
        let secondJobInput = screen.getByTestId("jobSite-2");
        let thirdJobInput = screen.getByTestId("jobSite-3");
        userEvent.selectOptions(firstJobInput, 'a1');
        userEvent.selectOptions(secondJobInput,'a2');
        userEvent.selectOptions(thirdJobInput,'a3');
        

        let firstRegInput = screen.getByTestId("regTimeInput-1");
        let secondRegInput = screen.getByTestId("regTimeInput-2");
        let thirdRegInput = screen.getByTestId("regTimeInput-3");

        let submitBtn = screen.getByTestId("submitMultiTimecardButton");

        userEvent.type(firstRegInput, '{backspace}');
        userEvent.type(firstRegInput, '8');
        userEvent.type(secondRegInput, '{backspace}');
        userEvent.type(secondRegInput, '8');
        userEvent.type(thirdRegInput, '{backspace}');
        userEvent.type(thirdRegInput, '8');
        
        await axios.post()
        userEvent.click(submitBtn)

    })
    expect(screen.getByText(/Timecard added!/)).toBeInTheDocument()

})

it('Multisite timecard gives errors if invalid input', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false  
    }
    axios.get = jest.fn().mockResolvedValue({ data: [{
        job_id:'a1',
        job_name: 'sewage plant'
    },
{
   job_id:'a2',
   job_name: 'skyscraper' 
},{
    job_id:'a3',
    job_name: 'ski hill' 
 }

] })
    
    render(
        <BrowserRouter>
             <UserContext.Provider value={mockUser}>
                    <MultiSiteTimecardForm></MultiSiteTimecardForm>
                </UserContext.Provider>
        </BrowserRouter>
    )
    await act(async()=>{

        await axios.get()
    })
    await act(async () => {

        let firstJobInput = screen.getByTestId("jobSite-1");
    
        userEvent.selectOptions(firstJobInput, 'a1');
        let overtimeInput = screen.getByTestId(`overtimeInput-1`);
        let firstRegInput = screen.getByTestId("regTimeInput-1");
        let secondRegInput = screen.getByTestId("regTimeInput-2");
        let submitBtn = screen.getByTestId("submitMultiTimecardButton");
        userEvent.type(firstRegInput, '{backspace}');
        userEvent.type(firstRegInput, '8');
        userEvent.type(overtimeInput, '{backspace}');
        userEvent.type(secondRegInput, '{backspace}');
        userEvent.click(submitBtn)

    })
    expect(screen.getByText(/Reg time cannot be blank./)).toBeInTheDocument()
    expect(screen.getByText(/Ensure you have selected a job site for all timecards./)).toBeInTheDocument()

})
