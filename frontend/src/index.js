import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LandPage from './LandPage';
import Timetable from './Timetable';
import reportWebVitals from './reportWebVitals';
import { Route,Routes,BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<LandPage/>}/>
                <Route path="/Timetable" element={<Timetable/>}/>
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

