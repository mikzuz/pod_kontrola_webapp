import {createContext, useState} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [uid, setUid] = useState(null); // Tutaj ustaw `uid` na odpowiednią wartość
    const [loggedInUser, setLoggedInUser] = useState(null); // Dodaj loggedInUser

    return (
        <UserContext.Provider value={{ uid, setUid, loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
};
