import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import App from './App';
import axios from 'axios'

jest.mock('axios')

it('Shows the login box when rendered', () =>{

    render(<App></App>)
    axios.get.mockResolvedValue({
        data:{
            noUser: 'Cannot find'
        }
    })
   
    expect(screen.getByText('Login')).toBeInTheDocument()



})