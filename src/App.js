import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import "./App.css";
import Login from "./components/Login";
import MonthlyReport from "./components/MonthlyReport";
import TablePillsMonthlyReport from "./components/TablePillsMonthlyReport";
import Navbar from "./components/Navbar";

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
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/tabletpillsmonthlyreport/:selectedPillId" element={<TablePillsMonthlyReport />} />
                <Route path="/monthlyReport" element={<MonthlyReport />} /> {/* Dodaj ścieżkę do MyComponent */}
            </Routes>
        </div>
    );
}

export default App;
