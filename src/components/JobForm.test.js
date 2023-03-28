import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import axios from 'axios'
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import JobForm from './JobForm';
import Login from './Login';
import Unauthorized from './Unauthorized';
import FourOhFour from './FourOhFour';
import userEvent from '@testing-library/user-event';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';
// HAS NOT BEEN STARTED, WAS COPED FROM EMPLOYEEFORM
jest.mock('axios')

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate

}))

it('Allows manager to create new job', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    await act(async () => {
        render(

            <UserContext.Provider value={mockManager}>
                <JobForm></JobForm>
            </UserContext.Provider>
        )
    });
    expect(screen.queryAllByText(/Add New Job/)[0]).toBeInTheDocument()

    let jId = screen.getByTestId("job-id-input");
    let jName = screen.getByTestId("job-name-input");
    let addressOne = screen.getByTestId("job-addressline1-input");
    let addressTwo = screen.getByTestId("job-addressline2-input");
    let city = screen.getByTestId("job-city-input");
    let description = screen.getByTestId("job-description-input");
    let shopDocs = screen.getByTestId("job-shopdocs-input");
    let submit = screen.getByTestId("job-submit-input");
    let heading = screen.getByTestId("edit-heading");


    await act(async () => {

        userEvent.type(jId, 'abc123')
        userEvent.type(jName, 'Good job')
        userEvent.type(addressOne, '123 Fake St');
        userEvent.type(city, 'Portland');
    });
    expect(jName).toHaveValue('Good job');
    expect(jId).toHaveValue('abc123');
    expect(addressOne).toHaveValue('123 Fake St')
    expect(city).toHaveValue('Portland');
    axios.post = jest.fn().mockResolvedValue(true)

    await act(async () => {
        userEvent.click(submit)
    });
    expect(mockedUseNavigate).toHaveBeenCalled()

})

it('Redirects to 404 if post request throws', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/jobs/new-job"]}>
            <UserContext.Provider value={mockManager}>
                <Routes>
                <Route path="/jobs/new-job" element={<JobForm></JobForm>} ></Route>
                <Route path="/404" element={<FourOhFour></FourOhFour>}></Route>
                </Routes>
            </UserContext.Provider>
            </MemoryRouter>
        )
    });
   

    let jId = screen.getByTestId("job-id-input");
    let jName = screen.getByTestId("job-name-input");
    let addressOne = screen.getByTestId("job-addressline1-input");
    let addressTwo = screen.getByTestId("job-addressline2-input");
    let city = screen.getByTestId("job-city-input");
    let description = screen.getByTestId("job-description-input");
    let shopDocs = screen.getByTestId("job-shopdocs-input");
    let submit = screen.getByTestId("job-submit-input");
    let heading = screen.getByTestId("edit-heading");


    await act(async () => {

        userEvent.type(jId, 'abc123')
        userEvent.type(jName, 'Good job')
        userEvent.type(addressOne, '123 Fake St');
        userEvent.type(city, 'Portland');
    });
    expect(jName).toHaveValue('Good job');
    expect(jId).toHaveValue('abc123');
    expect(addressOne).toHaveValue('123 Fake St')
    expect(city).toHaveValue('Portland');
    axios.post = jest.fn().mockRejectedValue(new Error('err'))

    await act(async () => {
        userEvent.click(submit)
    });
    expect(screen.getByText(/404. That's an error./)).toBeInTheDocument()
    }
)

it('Redirects to unauthorized - non-manager', async () => {

    const mockManager = {
        employeeId: 1,
        position: 1,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/jobs/new-job"]}>
            <UserContext.Provider value={mockManager}>
                <Routes>
                <Route path="/jobs/new-job" element={<JobForm></JobForm>} ></Route>
                <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>
                </Routes>
            </UserContext.Provider>
            </MemoryRouter>
        )
    });
   
    expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument()
    }
)

it('Redirects to unauthorized - null user', async () => {

    const mockManager = {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: false
    }
    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/jobs/new-job"]}>
            <UserContext.Provider value={mockManager}>
                <Routes>
                <Route path="/jobs/new-job" element={<JobForm></JobForm>} ></Route>
                <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>
                </Routes>
            </UserContext.Provider>
            </MemoryRouter>
        )
    });
    expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument()
    }
)

it('Catches form input errors', async () => {

    const mockManager = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
    await act(async () => {
        render(

            <UserContext.Provider value={mockManager}>
                <JobForm></JobForm>
            </UserContext.Provider>
        )
    });
    expect(screen.queryAllByText(/Add New Job/)[0]).toBeInTheDocument()

    let jId = screen.getByTestId("job-id-input");
    let jName = screen.getByTestId("job-name-input");
    let addressOne = screen.getByTestId("job-addressline1-input");
    let addressTwo = screen.getByTestId("job-addressline2-input");
    let city = screen.getByTestId("job-city-input");
    let description = screen.getByTestId("job-description-input");
    let shopDocs = screen.getByTestId("job-shopdocs-input");
    let submit = screen.getByTestId("job-submit-input");
    let heading = screen.getByTestId("edit-heading");

    await act(async () => {
        userEvent.click(submit)
    });

    expect(screen.getByText(/Job ID cannot be blank./)).toBeInTheDocument();
    expect(screen.getByText(/Job name cannot be blank./)).toBeInTheDocument();
    expect(screen.getByText(/Enter a job address./)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a city./)).toBeInTheDocument();


    await act(async () => {

        userEvent.type(jId, 'abc123')
        userEvent.type(jName, 'Good job')
        userEvent.type(addressOne, '123 Fake St');
        userEvent.type(city, 'Portland');
    });
    expect(jName).toHaveValue('Good job');
    expect(jId).toHaveValue('abc123');
    expect(addressOne).toHaveValue('123 Fake St')
    expect(city).toHaveValue('Portland');
    axios.post = jest.fn().mockResolvedValue(true)

    await act(async () => {
        userEvent.click(submit)
    });
    expect(mockedUseNavigate).toHaveBeenCalled()

})


