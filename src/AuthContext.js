import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    const loginUser = () => setLoggedIn(true);
    const logoutUser = () => setLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
