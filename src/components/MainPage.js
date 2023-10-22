import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import {IconButton, List, ListItem, ListItemText, styled, Button} from "@mui/material";
import {auth} from '../firebase-config';
import { getDatabase, ref, query, orderByChild, equalTo, onValue, get } from 'firebase/database';
import {useEffect, useState} from "react";

const MainPage = () => {

    const db = getDatabase();
    const [patientList, setPatientList] = useState([]);

    useEffect(() => {
        getDataFromDatabase();
    }, []);

    const getDataFromDatabase = () => {
        const userId = auth.currentUser.uid;
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
                    setPatientList(prevList => [...prevList, `${snapshot.val().firstName} ${snapshot.val().lastName}`]);
                }
            })
            .catch((error) => {
                console.error("Błąd pobierania danych:", error);
            });
    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h2 style={{margin: "20px 40px"}}>Lista pacjentów</h2>
            <Typography gutterBottom variant="subtitle1" component="div" style={{marginTop: "10px"}}>
                Poniżej znajduje się lista Twoich pacjentów.
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div" style={{marginBottom: "20px"}}>
                Pod Kontrolą pozwala Ci na bieżąco monitorować ich stan zdrowia dzięki raportom
                oraz szybko reagować na niepokojące zmiany poprzez edycję listy leków.
            </Typography>

            <div style={{display: "flex", minWidth: "600px", gap: "30px", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <Demo style={{minWidth: "inherit"}}>
                    <List>
                        {patientList.map((patientName) => (
                            <ListItem key={patientName}>
                                <IconButton disabled>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <ListItemText primary={patientName} />
                                <IconButton edge="end" aria-label="delete" style={{ margin: "0 3px" }}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="more">
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </div>
            <Button variant="outlined" style={{margin: "10px"}}>Dodaj pacjenta</Button>
        </div>
    );
};

export default MainPage;