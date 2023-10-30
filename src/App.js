import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import "./App.css";
import Login from "./components/Login";
import MonthlyReport from "./components/MonthlyReport";
import TablePillsMonthlyReport from "./components/TablePillsMonthlyReport";
import PillsList from "./components/PillsList";
import AddPatient from "./components/AddPatient";
import {BrowserRouter as Router} from 'react-router-dom';
import Notifications from './Notifications';

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
                    <Route path="/addPatient/:uid" element={<AddPatient />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
