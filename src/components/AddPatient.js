import React, {useEffect, useState} from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth, database} from './firebase-config';
import {Navigate, useNavigate} from "react-router-dom";
import "../Auth.css";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {get, ref, set} from "firebase/database";

const AddPatient = () => {
    const navigate = useNavigate();
    const userId = auth.currentUser.uid;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const addPatient = async (patientId) => {
        const id = new Date().getTime().toString();

        try {
            if (patientId !== null) {
                await set(ref(database, 'Patients/' + id), {
                    doctor: userId,
                    id: id,
                    patient: patientId
                })
                toast.info("Dodano pacjenta!")
                navigate(`/mainPage`);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getPatientFromDatabase = async () => {
        const usersRef = ref(database, 'Users');

        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {

                const users = snapshot.val();
                const matchingUser = Object.keys(users).filter(key => users[key].email === email && users[key].firstName === firstName && users[key].lastName === lastName);
                if (matchingUser.length !== 0) {
                    addPatient(matchingUser[0]);
                } else {
                    toast.error("Brak pacjenta o podanych danych")
                    return null;
                }
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        });
    }

    return (
            <div className="Auth-form-container">
                <div id="background1"></div>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Dodaj nowego pacjenta</h3>
                        <div className="form-group mt-3">
                            <label className="auth-label">Imię</label>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Wpisz imię"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="auth-label">Nazwisko</label>
                            <input
                                type="lastName"
                                className="form-control mt-1"
                                placeholder="Wpisz nazwisko"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Wpisz email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button className="buttonS" onClick={getPatientFromDatabase} type="button">
                                Dodaj
                            </button>
                        </div>
                    </div>
                </form>
                <div id="background2"></div>
            </div>
    );
};

export default AddPatient;
