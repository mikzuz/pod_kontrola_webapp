import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import "./App.css";
import Login from "./components/Login";

/**
 * Główny komponent aplikacji.
 *
 * @returns {JSX.Element} Wyrenderowany komponent App.
 */
const App = () => {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mainPage" element={<MainPage />} />
        </Routes>
      </div>
  );
}

export default App;
