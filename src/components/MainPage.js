import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import { IconButton, List, ListItem, ListItemText, styled, Button } from "@mui/material";
import {auth} from './firebase-config';
import { ref, query, orderByChild, equalTo, onValue, get, remove, set } from 'firebase/database';
import {useEffect, useState} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate, useParams} from "react-router-dom";
import { database } from "./firebase-config";
import Notifications from "../Notifications";
import Navbar from "./Navbar";

const MainPage = () => {

    const { uid } = useParams();

    const theme = createTheme({
        palette: {
            blue: {
                main: '#8ed1fc',
            },
        },
        props: {
            // Przekaż `uid` do motywu
            MuiButtonBase: {
                uid: uid,
            },
        },
    });

    const navigate = useNavigate();
    const userId = auth.currentUser.uid;
    const [patientList, setPatientList] = useState([]);
    const [activePatient, setActivePatient] = useState(null);

    useEffect(() => {
        getDataFromDatabase();
    }, []);


    console.log(uid);

    // function generate(element) {
    //     return [0, 1, 2].map((value) =>
    //         React.cloneElement(element, {
    //             key: value,
    //
    //
    //
    // useEffect(() => {
    //     getDataFromDatabase();
    // }, []);

    const getDataFromDatabase = () => {
        const doctorRef = ref(database, "Patients");
        const queryRef = query(doctorRef, orderByChild("doctor"), equalTo(userId));

        onValue(queryRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const patientId = childSnapshot.child("patient").val();
                getPatientFromDatabase(patientId);
            });
        }, (error) => {
            console.error('Błąd', error);
        });
    };

    const getPatientFromDatabase = (patientId) => {
        const patientRef = ref(database, `Users/${patientId}`);

        // Pobranie danych
        get(patientRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setPatientList(prevList => [...prevList, [`${snapshot.val().firstName} ${snapshot.val().lastName}`, `${snapshot.val().id}`]]);
                }
            })
            .catch((error) => {
                console.error("Błąd pobierania danych:", error);
            });
    }

    const deletePatient = (patientId) => {
        const patientsRef = ref(database, 'Patients');

        get(patientsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const patients = snapshot.val();
                const matchingPatients = Object.keys(patients).filter(key => patients[key].patient === patientId);
                const patientRef = ref(database, `Patients/${matchingPatients[0]}`);
                remove(patientRef).then(() => {
                    console.log(`Usunięto pacjenta o id ${patientId}`);
                }).catch((error) => {
                    console.error('Błąd podczas usuwania:', error);
                });
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
        });
    };

    const addPatient = () => {
        const id = new Date().getTime().toString();

        set(ref(database, 'Patients/' + id), {
            doctor: userId,
            id: id,
            patient: "aaaaaaaaaaaaa"
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
        });
    };

    const showOptions = (patientId) => {
        if (activePatient === patientId) {
            setActivePatient(null); // Jeśli kliknięty pacjent jest już aktywny, wyłącz opcje
        } else {
            setActivePatient(patientId);
        }
    };

    const showMonthlyReport = (patientId) => {
        navigate(`/monthlyReport/${uid}/${patientId}`);
    }

    const showPillsList = (patientId) => {
        navigate(`/pillsList/${uid}/${patientId}`);
    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    const handleNotificationsClick = () => {
        navigate(`/notifications/${uid}`);
    };


    return (
        <div>
            <ThemeProvider theme={theme} uid={uid} >
                <Navbar uid={uid} />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
                <h1 style={{ margin: "20px 40px" }}>Lista pacjentów</h1>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Poniżej znajduje się lista Twoich pacjentów.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Jeśli nie jest ona aktualna w każdej chwili możesz ją edytować, dodając lub usuwając z niej podopiecznych.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginBottom: "20px", textAlign: "center" }}>
                    Pod Kontrolą pozwala Ci na bieżąco monitorować stan zdrowia Twoich pacjentów, dzięki wypełnianym przez podopiecznych raportom, oraz szybko reagować na niepokojące zmiany poprzez edycję listy zażywanych leków.
                </Typography>

            <div style={{display: "flex", minWidth: "600px", gap: "30px", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <Demo style={{minWidth: "inherit"}}>
                    <List>
                        {patientList.map((patientName) => (
                            <div key={patientName}>
                                <ListItem >
                                <IconButton disabled>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <ListItemText primary={patientName[0]} />
                                    <IconButton edge="end" aria-label="more" onClick={() => {showOptions(patientName[1]);}}>
                                        <MoreVertIcon />
                                    </IconButton>
                                <IconButton edge="end" aria-label="delete" style={{ margin: "0 3px" }} onClick={() => {deletePatient(patientName[1]);}}>
                                    <DeleteIcon />
                                </IconButton>
                                </ListItem>
                                <div className="options" style={{display: patientName[1] === activePatient ? 'flex' : 'none', height: "40px", justifyContent: "center", alignItems: "center"}}>
                                    <Button
                                        variant="outlined"
                                        style={{ margin: "0 10px" }}
                                        onClick={() => {showMonthlyReport(patientName[1]);}}
                                    >
                                        Zobacz raport
                                    </Button>
                                    <Button variant="outlined" style={{margin: "0 10px"}} onClick={() => {showPillsList(patientName[1])}}>Lista leków pacjenta</Button>
                                </div>
                            </div>
                        ))}
                    </List>
                </Demo>
            </div>
            <Button variant="contained" color="blue" style={{margin: "10px"}} onClick={() => {addPatient()}}>Dodaj pacjenta</Button>
        </div>
            </ThemeProvider>
        </div>
    );
};

export default MainPage;
