import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import baseURL from '../helpers/constants';



function MyTimecards() {

    const { employeeId, position, userNotFound, firstName } = useContext(UserContext);
    const [serverError, setServerError] = useState(false);
    const [timecardsData, setTimecardsData] = useState([]);
    const WEEKDAYS = {0: 'Monday', 1:'Tuesday', 2:'Wednesday',3:'Thursday',4: 'Friday'}
    

    useEffect(() => {

        async function getIndividualTimecards() {
            try {
            let res = await axios.get(`${baseURL}/timecards/reports/weekly/${employeeId}`);
            console.log(res)
            generateTable(res.data)
            }
            catch (e) {
                setServerError(true)
            }
        }
        getIndividualTimecards()

    }, [])

    

    function generateTable(table){
        let res = []
        
        let today = new Date().getDay();
        let firstRow = new Array(today+1).fill(false);
        while(today >= 0){
            let curr = table.pop();
            firstRow[today] = curr === null ? false : true;
            today--;
        }
        let secondRow = new Array(7).fill(false);
        let counter = 6;
        while(counter >= 0){
            let curr = table.pop();
            secondRow[counter] = curr === null ? false : true;
            counter--;
        }
        counter = 6;
        let lastRow = new Array(7).fill(false);
        while(counter >= 0){
            let curr = table.pop();
            lastRow[counter] = curr === null ? false : true;
            counter--;
        }
        res = [lastRow, secondRow, firstRow]
        console.log(res)
    }


    if(serverError === true) return <Navigate to="/404" replace={false}></Navigate>

    if (employeeId === null && userNotFound === true) {
        return <Navigate to="/login" replace={true}></Navigate>
    }

    return (
        <div>
            <h2>{firstName}, these are the timecards you've been submitted over the past 2 weeks.</h2>
            

        </div>

    )





}

export default MyTimecards;