import React from 'react';
import CollapsibleExample from './Navbar'; // Zaimportuj komponent


function Dashboard() {
    return (
        <div>

            <CollapsibleExample /> {/* Użyj komponentu CollapsibleExample */}

            {/* Tutaj możesz dodać zawartość swojego dashboardu */}
            <h1>Dashboard Content</h1>
        </div>
    );
}

export default Dashboard;
