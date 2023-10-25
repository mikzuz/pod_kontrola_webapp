import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';

import MainPage from './components/MainPage';
import Navbar from './components/Navbar';
import Notifications from './Notifications';
import Login, {useAuth} from './components/Login';
import MonthlyReport from './components/MonthlyReport';
import TablePillsMonthlyReport from './components/TablePillsMonthlyReport';
import PillsList from './components/PillsList';

const App = () => {

    return (
        <Router>
            <div>
                {/*<Navbar uid={uid} />*/}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/mainPage/:uid" element={<MainPage />} />
                    <Route path="/tabletpillsmonthlyreport/:uid/:patientId/:selectedPillId/:selectedMonth" element={<TablePillsMonthlyReport />} />
                    <Route path="/monthlyReport/:uid/:patientId" element={<MonthlyReport />} />
                    <Route path="/notifications/:uid" element={<Notifications />} />
                    <Route path="/pillsList/:uid/:patientId" element={<PillsList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
