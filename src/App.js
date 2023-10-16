import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";

import "./App.css";
import Dashboard from "./Dashboard";

/**
 * Główny komponent aplikacji.
 *
 * @returns {JSX.Element} Wyrenderowany komponent App.
 */
const App = () => {
  return (
      <div>

        {/* Definiuje trasy */}
        <Routes>
          {/* Definiuje trasę dla głównej strony */}
          <Route path="/" element={<MainPage />} />

          {/* Definiuje trasę dla dashboardu */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/*/!* Definiuje trasę dla strony autoryzacji *!/*/}
          {/*<Route path="/auth" element={<Auth />} />*/}

          {/*/!* Definiuje trasę dla formularza statystyk *!/*/}
          {/*<Route path="/add-stats" element={<StatsForm />} />*/}
        </Routes>
      </div>
  );
};

export default App;
