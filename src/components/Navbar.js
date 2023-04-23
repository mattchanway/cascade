import React, { useContext, useState } from 'react';
import UserContext from './UserContext';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useNavigate, Navigate } from "react-router-dom";
import baseURL from '../helpers/constants';


function Navibar({setLoggedInUser}) {
    axios.defaults.withCredentials = true;
    const [loggedOut, setLoggedOut] = useState(false)
    const { employeeId, position, firstName, lastName } = useContext(UserContext);
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false)
    let welcome = firstName ? `Welcome, ${firstName} ${lastName}` : 'Cascade Metal Design'
    let breakpoint = position === 3 ? 'md' : 'sm' ;
  

    async function doLogout() {

        

        await axios.post(`${baseURL}/auth/logout`);
        setLoggedInUser({
            employeeId: null,
            position: null,
            firstName: null,
            lastName: null,
            userNotFound: true
          })
          setIsExpanded(false);
         setLoggedOut(true)
    }

    // if(loggedOut === true) return <Navigate to="/login" replace={false}></Navigate>

    return (
        <Navbar sticky = "top" style={{backgroundColor:'#0076bd'}} expanded={isExpanded} variant="dark" expand={breakpoint} onToggle={()=> setIsExpanded(!isExpanded)}>
            <Navbar.Brand>{welcome}</Navbar.Brand>
            
            
        
            
           {<Navbar.Toggle aria-controls="responsive-navbar-nav" />}
           
            <Navbar.Collapse>
            <Nav className="me-auto">
            {firstName && <Nav.Link href="/">All Jobs</Nav.Link>}
                {position === 3 && <Nav.Link href="/reports">Reports</Nav.Link>}
                {!position && <Nav.Link href="/login">Login</Nav.Link>}
                
               
                {position === 3 && <Nav.Link href="/admin">Admin</Nav.Link>}
                 
                {position === 3 &&<Nav.Link href="/employees">Employees</Nav.Link>}
                {position && <Nav.Link href="/my-profile">My Timecards</Nav.Link>}
                {position && <Nav.Link href="/add-multiple-timecards">Multi-Site</Nav.Link>}
                {firstName && <Nav.Link onClick={doLogout} data-testid="logout-test-btn">Logout</Nav.Link>} 
               
                
               
            </Nav>
            </Navbar.Collapse>
           
            {/* {firstName && <p style={{marginRight: '10px', float: 'right'}}>Welcome, {firstName} {lastName} </p>} */}
        </Navbar>

    )





}

export default Navibar;