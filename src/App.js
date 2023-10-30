import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import "./App.css";
import Login from "./components/Login";
import MonthlyReport from "./components/MonthlyReport";
import TablePillsMonthlyReport from "./components/TablePillsMonthlyReport";
import Navbar from "./components/Navbar";
import PillsList from "./components/PillsList";
import AddPatient from "./components/AddPatient";
import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Notifications from './Notifications';
import MonthlyReport from './components/MonthlyReport';
import TablePillsMonthlyReport from './components/TablePillsMonthlyReport';

const App = () => {

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/mainPage/:uid" element={<MainPage />} />
                    <Route path="/tabletpillsmonthlyreport/:uid/:patientId/:selectedPillId/:selectedMonth" element={<TablePillsMonthlyReport />} />
                    <Route path="/monthlyReport/:uid/:patientId" element={<MonthlyReport />} />
                    <Route path="/notifications/:uid" element={<Notifications />} />
                    <Route path="/pillsList/:uid/:patientId" element={<PillsList />} />
                    <Route path="/addPatient" element={<AddPatient />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
