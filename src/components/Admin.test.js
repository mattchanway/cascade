import React from 'react';
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import UserContext from './UserContext';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Unauthorized from './Unauthorized';
import Login from './Login';
import FourOhFour from './FourOhFour';

jest.mock('axios')
// const mockedUseNavigate = jest.fn();

// function mockNavigate(){

//     return(
//         <Unauthorized></Unauthorized>
//     )

// }
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     Navigate: mockNavigate,
//     useNavigate: ()=> mockedUseNavigate

// }))

it('Shows the admin list when the manager accesses', async () => {

    const mockUser = {
        employeeId: 1,
        position: 3,
        firstName: 'Shawn',
        lastName: 'Rostas',
        userNotFound: false,
        firstLogin: false
    }
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
    expect(screen.getByText(/Add a New Job/)).toBeInTheDocument()

})

it('Redirects to unauthorized when non manager accesses', async () => {

    

    const mockUser = {
        employeeId: 1,
        position: 1,
        firstName: 'Chud',
        lastName: 'Rost',
        userNotFound: false,
        firstLogin: false
    }
    // axios.get = jest.fn().mockResolvedValue({data : mockJobsList})

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/admin"]}>
            <UserContext.Provider value={mockUser}>
             <Routes>
             <Route path ="/404" element={<FourOhFour></FourOhFour>}></Route>
             <Route path ="/admin" element={<Admin></Admin>}></Route>
             <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>

             </Routes>
           
         </UserContext.Provider>
     </MemoryRouter>
        )
        })
    
  
        expect(screen.getByText(/You do not have permission to view this page./)).toBeInTheDocument()
    

})

it('Redirects to Login when logged-out accesses', async () => {

    

    let nullUser= {
        employeeId: null,
        position: null,
        firstName: null,
        lastName: null,
        userNotFound: true,
        firstLogin: null,
        passwordReset: false
      }
    // axios.get = jest.fn().mockResolvedValue({data : mockJobsList})

    await act(async () => {
        render(
            <MemoryRouter initialEntries={["/admin"]}>
            <UserContext.Provider value={nullUser}>
             <Routes>
             <Route path ="/404" element={<FourOhFour></FourOhFour>}></Route>
             <Route path ="/admin" element={<Admin></Admin>}></Route>
             <Route path="/unauthorized" element={<Unauthorized></Unauthorized>}></Route>
             <Route path="/login" element={<Login></Login>}></Route>

             </Routes>
           
         </UserContext.Provider>
     </MemoryRouter>
        )
        })
    
  
        expect(screen.getByText(/Login/)).toBeInTheDocument()
    

})