/**
 * Komponent autoryzacji.
 * @module Auth
 */

import React, {useEffect, useState} from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth} from './firebase-config';
import {Navigate, useNavigate} from "react-router-dom";
import "../Auth.css";

/**
 * Hook używany do zarządzania autoryzacją.
 * @returns {Object} - Obiekt zawierający informacje o autoryzacji.
 * @property {boolean} authenticated - Flaga określająca, czy użytkownik jest uwierzytelniony.
 * @property {Object} user - Obiekt reprezentujący aktualnie zalogowanego użytkownika.
 * @property {Function} logout - Funkcja do wylogowywania użytkownika.
 */
export const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setAuthenticated(true);
                setUser(user);
            } else {
                setAuthenticated(false);
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return { authenticated, user, logout };
};

/**
 * Komponent autoryzacji.
 * @param {Object} props - Właściwości komponentu.
 * @returns {JSX.Element} - Wygenerowany element JSX.
 */
export default function Auth(props) {
    let [authMode, setAuthMode] = useState("signin");

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));

    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Dodajemy stan użytkownika


    /**
     * Funkcja do zmiany trybu autoryzacji.
     */
    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin");
    };

    /**
     * Funkcja do rejestracji użytkownika.
     */
    const register = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            const newUser = userCredential.user;
            setUser(newUser); // Ustawienie użytkownika
            setAuthenticated(true);
            localStorage.setItem("authenticated", true);
            navigate(`/mainPage/${newUser.uid}`); // Przekierowanie z UID
        } catch (error) {
            console.log(error.message);
            alert("Wprowadzono niepoprawne dane!");
            setRegisterEmail(""); // Wyczyszczenie pola email
            setRegisterPassword(""); // Wyczyszczenie pola hasło
        }
    }

    /**
     * Funkcja do logowania użytkownika.
     */
    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const loggedInUser = userCredential.user;
            setUser(loggedInUser); // Ustawienie użytkownika
            setAuthenticated(true);
            localStorage.setItem("authenticated", true);
            navigate(`/mainPage/${loggedInUser.uid}`); // Przekierowanie z UID
        } catch (error) {
            console.log(error.message);
            alert("Wprowadzono niepoprawne dane!");
            setLoginEmail(""); // Wyczyszczenie pola email
            setLoginPassword(""); // Wyczyszczenie pola hasło
        }
    }

    useEffect(() => {
        console.log(authenticated);
    }, [authenticated]);

    /**
     * Funkcja do wylogowywania użytkownika.
     */
    const logout = async () => {
        await signOut(auth);
    };

    if (authenticated) {
        return <Navigate to={`/mainPage/${user.uid}`} replace />;
    }

    if (authMode === "signin") {
        return (
            <>
                {/*<MainNavbar />*/}
                <div className="Auth-form-container">
                    <div id="background1"></div>
                    <form className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title">Zaloguj się</h3>
                            <div className="text-center">
                                Jeszcze nie zarejestrowany?{" "}
                                <span className="link-primary custom-color" onClick={changeAuthMode}>
                                    Zarejestruj się
                                </span>
                            </div>
                            <div className="form-group mt-3">
                                <label className="auth-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control mt-1"
                                    placeholder="Wpisz email"
                                    value={loginEmail}
                                    onChange={(event) => setLoginEmail(event.target.value)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label className="auth-label">Hasło</label>
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    placeholder="Wpisz hasło"
                                    value={loginPassword}
                                    onChange={(event) => setLoginPassword(event.target.value)}
                                />
                            </div>

                            <div className="d-grid gap-2 mt-3">
                                <button className="buttonS" onClick={login} type="button">
                                    Wyślij
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="background2"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="Auth-form-container">
                <div id="background1"></div>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Zarejestruj się</h3>
                        <div className="text-center">
                            Zarejestrowany?{" "}
                            <span className="link-primary custom-color" onClick={changeAuthMode}>
                Zaloguj się
              </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Email"
                                value={registerEmail}
                                onChange={(event) => setRegisterEmail(event.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Hasło</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Hasło"
                                value={registerPassword}
                                onChange={(event) => setRegisterPassword(event.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button onClick={register} type="button" className="buttonS">
                                Wyślij
                            </button>
                        </div>
                    </div>
                </form>
                <div id="background2"></div>
            </div>
        </>
    );
}