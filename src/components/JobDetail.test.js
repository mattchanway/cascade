import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import JobDetail from './JobDetail';
import FourOhFour from './FourOhFour';
import Login from './Login';

jest.mock('axios')

let mockedUseNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: ()=> mockedUseNavigate

}))


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

it('Shows a server error if API throws on job load', async () => {

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Bud',
        lastName: 'Gomley',
        userNotFound: false,
        firstLogin: false
    }

    render(
        <MemoryRouter initialEntries={["/jobs/job1"]}>
            <UserContext.Provider value={mockUser}>
            <Routes>
            
                <Route>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
                </Route>
            </Routes>
            </UserContext.Provider>
        </MemoryRouter>
    )
    axios.get = jest.fn().mockRejectedValue(new Error('err'));
   
   

    await act(async () => {

    })
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()

})

it('Redirects to login page for unauthenticated user', async () => {

    const mockUser = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: null
    }

    render(
        <MemoryRouter initialEntries={["/jobs/job1"]}>
            <UserContext.Provider value={mockUser}>
            <Routes>
                <Route>
                <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                </Route>
            </Routes>
            </UserContext.Provider>
        </MemoryRouter>
    )
    // axios.get = jest.fn().mockRejectedValue(new Error('err'));
    await act(async () => {

    })
    expect(screen.getByText(/Login/)).toBeInTheDocument()

})

it('Shows the appropriate notification if error in submitting timecard', async () => {

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

    axios.get = jest.fn().mockResolvedValueOnce({ data: mockJob })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
                <UserContext.Provider value={mockUser}>
                    <JobDetail></JobDetail>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

  

    await act(async () => {

        let showTimecardBtn = screen.getByTestId('showAddTimecardForm');
        userEvent.click(showTimecardBtn);
    });

    // axios.get.mockImplementation(() => {

    //     return Promise.reject(new Error('error'))

    // }
    // )
    axios.post = jest.fn().mockRejectedValueOnce(new Error('err'))


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
       
    });

    expect(screen.getByText(/There was an error and your timecard was not added./)).toBeInTheDocument()

})

it('Non-manager cannot see edit button', async () => {

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

    axios.get = jest.fn().mockResolvedValueOnce({ data: mockJob })
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
                <UserContext.Provider value={mockUser}>
                    <Routes>
                <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
                </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
    });

    expect(screen.queryByText(/Edit Job Details/)).not.toBeInTheDocument();
   

})

it('Manager can access edit form and edit job', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockJob = {
        job_id: '123abc',
        job_name: 'S',
        job_address_street_line1: '69 Sewage St',
        job_address_street_line2: null,
        job_address_street_unit: '#69',
        job_address_street_city: 'Sewerland',
        job_description: 'Clean up',
        shop_docs_link: null
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockJob })
    
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
        

    });

    let editBtn = screen.getByTestId('job-edit-btn')
    
    await act(async () => {
        userEvent.click(editBtn);
    })
        let jId = screen.getByTestId("job-id-input");
        let jName = screen.getByTestId("job-name-input")
        let addressOne = screen.getByTestId("job-addressline1-input");
        let addressTwo = screen.getByTestId("job-addressline2-input");
        let city = screen.getByTestId("job-city-input");
        let description = screen.getByTestId("job-description-input");
        let shopDocs = screen.getByTestId("job-shopdocs-input");
        let submit = screen.getByTestId("job-submit-input");
        let heading = screen.getByTestId("edit-heading");
     

    await act(async() => {
        
            userEvent.type(jName, 'alto')
            userEvent.type(city, 'ia')
            userEvent.type(description, ' NOW!')
            
    })
    expect(jId).toHaveAttribute('disabled');
    expect(editBtn).toHaveTextContent('Edit Job')
    expect(jName).toHaveValue('Salto')
    expect(city).toHaveValue('Sewerlandia')
    expect(description).toHaveValue('Clean up NOW!')
    axios.put = jest.fn().mockResolvedValue(true)
    await act(async() => {
        
        userEvent.click(submit)
})

    expect(mockedUseNavigate).toHaveBeenCalled();

})

it('Redirects to 404 if put request throws.', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    const mockJob = {
        job_id: '123abc',
        job_name: 'S',
        job_address_street_line1: '69 Sewage St',
        job_address_street_line2: null,
        job_address_street_unit: '#69',
        job_address_street_city: 'Sewerland',
        job_description: 'Clean up',
        shop_docs_link: null
    }

    axios.get = jest.fn().mockResolvedValue({ data: mockJob })
    
    await act(async () => {

        render(
            <MemoryRouter initialEntries={["/jobs/123abc"]}>
                <UserContext.Provider value={mockManager}>
                <Routes>
                    <Route path="/jobs/:id" element={<JobDetail></JobDetail>} ></Route>
                    <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        )
        

    });

    let editBtn = screen.getByTestId('job-edit-btn')
    
    await act(async () => {
        userEvent.click(editBtn);
    })
        let jName = screen.getByTestId("job-name-input")
        let addressOne = screen.getByTestId("job-addressline1-input");
        let addressTwo = screen.getByTestId("job-addressline2-input");
        let city = screen.getByTestId("job-city-input");
        let description = screen.getByTestId("job-description-input");
        let shopDocs = screen.getByTestId("job-shopdocs-input");
        let submit = screen.getByTestId("job-submit-input");
        let heading = screen.getByTestId("edit-heading");
     

    await act(async() => {
        
            userEvent.type(jName, 'alto')
            userEvent.type(city, 'ia')
            userEvent.type(description, ' NOW!')
            
    })
    expect(editBtn).toHaveTextContent('Edit Job')
    expect(jName).toHaveValue('Salto')
    expect(city).toHaveValue('Sewerlandia')
    expect(description).toHaveValue('Clean up NOW!')
    axios.put = jest.fn().mockRejectedValue(new Error('err'))
    await act(async() => {
        
        userEvent.click(submit)
})

    expect(screen.getByText(/404. That's an error/)).toBeInTheDocument();

})