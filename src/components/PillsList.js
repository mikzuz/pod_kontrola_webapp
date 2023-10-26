import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import { IconButton, List, ListItem, ListItemText, styled, Button } from "@mui/material";
import { ref, query, orderByChild, equalTo, onValue, get, remove, set } from 'firebase/database';
import {useEffect, useState} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useParams} from "react-router-dom";
import { database } from "./firebase-config";
import {useNavigate} from "react-router-dom";

const MainPage = () => {

    const theme = createTheme({
        palette: {
            blue: {
                main: '#8ed1fc',
            },
        },
    });

    let { patientId } = useParams();
    const [pillsList, setPillsList] = useState([]);
    const [patientName, setPatientName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getPatientNameFromDatabase()
        getDataFromDatabase();
    }, []);

    const getDataFromDatabase = () => {
        const pillsRef = ref(database, "Pills");
        const queryRef = query(pillsRef, orderByChild("pacient"), equalTo(patientId));

        onValue(queryRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const pillName = childSnapshot.child("name").val();
                const pillId = childSnapshot.child("id").val();
                setPillsList(prevList => [...prevList, [`${pillName}`, `${pillId}`]]);
            });
        }, (error) => {
            console.error('Błąd', error);
        });
    };

    const getPatientNameFromDatabase = () => {
        const patientRef = ref(database, `Users/${patientId}`);

        get(patientRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setPatientName(`${snapshot.val().firstName} ${snapshot.val().lastName}`);
                }
            })
            .catch((error) => {
                console.error("Błąd pobierania danych:", error);
            });
    }

    const deletePill = (pillId) => {
    //     console.log(patientId)
    //     const patientsRef = ref(db, 'Patients');
    //
    //     get(patientsRef).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             const patients = snapshot.val();
    //             const matchingPatients = Object.keys(patients).filter(key => patients[key].patient === patientId);
    //             const patientRef = ref(db, `Patients/${matchingPatients[0]}`);
    //             remove(patientRef).then(() => {
    //                 console.log(`Usunięto pacjenta o id ${patientId}`);
    //             }).catch((error) => {
    //                 console.error('Błąd podczas usuwania:', error);
    //             });
    //         }
    //     }).catch((error) => {
    //         console.error('Błąd podczas pobierania danych:', error);
    //     });
    };

    // const addPatient = () => {
    //     const id = new Date().getTime().toString();
    //
    //     set(ref(db, 'Patients/' + id), {
    //         doctor: userId,
    //         id: id,
    //         patient: "aaaaaaaaaaaaa"
    //     }).catch((error) => {
    //         console.error('Błąd podczas pobierania danych:', error);
    //     });
    // };

    const editPill = (pillId) => {
        navigate(`/editPill/${pillId}`);
    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <div>
            <ThemeProvider theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
                <h1 style={{ margin: "20px 40px 0 40px" }}>Lista leków pacjenta</h1>
                <h1 style={{ margin: "20px 40px" }}>{patientName}</h1>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Poniżej znajduje się lista leków przypisanych do Twojego pacjenta.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Jeśli nie jest ona aktualna w każdej chwili możesz ją edytować, dodając lub usuwając z niej pozycje.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginBottom: "20px" }}>
                    Pod Kontrolą pozwala Ci szybko reagować na niepokojące zmiany w stanie zdrowia Twoich pacjentów poprzez edycję listy zażywanych leków.
                </Typography>

            <div style={{display: "flex", minWidth: "600px", gap: "30px", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <Demo style={{minWidth: "inherit"}}>
                    <List>
                        {pillsList.map((pillName) => (
                            <div key={pillName[1]}>
                                <ListItem >
                                <IconButton disabled>
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <ListItemText primary={pillName[0]} />
                                    <IconButton edge="end" aria-label="more" onClick={() => {editPill(pillName[1])}}>
                                        <MoreVertIcon />
                                    </IconButton>
                                <IconButton edge="end" aria-label="delete" style={{ margin: "0 3px" }} onClick={() => {deletePill(pillName[1])}}>
                                    <DeleteIcon />
                                </IconButton>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </Demo>
            </div>
            <Button variant="contained" color="blue" style={{margin: "10px"}} onClick={() => {}}>Dodaj lek</Button>
        </div>
            </ThemeProvider>
        </div>
    );
};

export default MainPage;