import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import { IconButton, List, ListItem, ListItemText, styled, Button } from "@mui/material";
// import CollapsibleExample from './NavbarNew'; // Zaimportuj komponent
import Navbar from './Navbar';
import {auth} from './firebase-config';
import { getDatabase, ref, query, orderByChild, equalTo, onValue, get, remove, set } from 'firebase/database';
import {useEffect, useState} from "react";

const MainPage = () => {

    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const [patientList, setPatientList] = useState([]);
    const [ optionsDisplay, setOptionsDisplay ] = useState('none');

    useEffect(() => {
        getDataFromDatabase();
    }, []);

    const getDataFromDatabase = () => {
        const doctorRef = ref(db, "Patients");
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
        const patientRef = ref(db, `Users/${patientId}`);

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
        console.log(patientId)
        const patientsRef = ref(db, 'Patients');

        get(patientsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const patients = snapshot.val();
                const matchingPatients = Object.keys(patients).filter(key => patients[key].patient === patientId);
                const patientRef = ref(db, `Patients/${matchingPatients[0]}`);
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

        set(ref(db, 'Patients/' + id), {
            doctor: userId,
            id: id,
            patient: "aaaaaaaaaaaaa"
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
        });
    };

    const showOptions = () => {
        if(optionsDisplay === "none") {
            setOptionsDisplay("flex")
        } else {
            setOptionsDisplay("none")
        }
    }

    const showMonthlyReport = () => {

    }

    const showPillsList = () => {

    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <div>
            {/*<Navbar />*/}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
                <h1 style={{ margin: "20px 40px" }}>Lista pacjentów</h1>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Poniżej znajduje się lista Twoich pacjentów.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginBottom: "20px" }}>
                    Pod Kontrolą pozwala Ci na bieżąco monitorować ich stan zdrowia dzięki raportom oraz szybko reagować na niepokojące zmiany poprzez edycję listy leków.
                </Typography>

            <div style={{display: "flex", minWidth: "600px", gap: "30px", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <Demo style={{minWidth: "inherit"}}>
                    <List>
                        {patientList.map((patientName) => (
                            <ListItem key={patientName}>
                                <IconButton disabled>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <ListItemText primary={patientName[0]} />
                                <IconButton edge="end" aria-label="delete" style={{ margin: "0 3px" }} onClick={() => {deletePatient(patientName[1]);}}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="more" onClick={() => {showOptions();}}>
                                    <MoreVertIcon />
                                </IconButton>
                                <div class="options" style={{display: optionsDisplay, height: "100px"}}>
                                    <Button variant="outlined" style={{margin: "10px"}} onClick={() => {showMonthlyReport()}}>Raport miesięczny</Button>
                                    <Button variant="outlined" style={{margin: "10px"}} onClick={() => {showPillsList()}}>Lista leków pacjenta</Button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </div>
            <Button variant="outlined" style={{margin: "10px"}} onClick={() => {addPatient()}}>Dodaj pacjenta</Button>
        </div>
        </div>
    );
};

export default MainPage;
