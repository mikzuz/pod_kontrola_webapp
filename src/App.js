import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import Notifications from "./components/Notifications";

import "./App.css";
import Login from "./components/Login";
import MonthlyReport from "./components/MonthlyReport";
import TablePillsMonthlyReport from "./components/TablePillsMonthlyReport";
import Navbar from "./components/Navbar";
import PillsList from "./components/PillsList";

/**
 * Główny komponent aplikacji.
 *
 * @returns {JSX.Element} Wyrenderowany komponent App.
 */
const App = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/mainPage/:uid" element={<MainPage />} />
                <Route path="/tabletpillsmonthlyreport/:selectedPillId/:selectedMonth" element={<TablePillsMonthlyReport />} />
                <Route path="/monthlyReport" element={<MonthlyReport />} /> {/* Dodaj ścieżkę do MyComponent */}
                <Route path="/notifications/:uid" element={<Notifications />} /> {/* Dodaj ścieżkę do MyComponent */}

                <Route path="/pillsList/:patientId" element={<PillsList />} />
            </Routes>
        </div>
    );
}

export default App;
