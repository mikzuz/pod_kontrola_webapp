import React, {useState} from "react";
import {auth, database} from './firebase-config';
import {useNavigate, useParams} from "react-router-dom";
import "../Auth.css";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {get, ref, set} from "firebase/database";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Navbar from "./Navbar";

const AddPatient = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const [pesel, setPesel] = useState("");
    const [searchPatient, setSearchPatient] = useState(false);
    const [patientId, setPatientId] = useState("");
    const [patientData, setPatientData] = useState([]);

    function createData(pesel, lastName, firstName, email) {
        return { pesel, lastName, firstName, email };
    }

    const rows = [
        createData(patientData[0], patientData[1], patientData[2], patientData[3]),
    ];

    const addPatient = async () => {
        if(!checkIfAlreadyPatient(patientId)) {
            toast.error("Użytkownik o podanym numerze PESEL już jest Twoim pacjentem")
            return
        };
        const id = new Date().getTime().toString();

        try {
            if (patientId !== null) {
                await set(ref(database, 'Patients/' + id), {
                    doctor: uid,
                    id: id,
                    patient: patientId,
                })
                toast.info("Dodano pacjenta!") //tez sie nie pokazuje
                navigate(`/mainPage/${uid}`);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getPatientFromDatabase = async () => {
        if(pesel.length !== 11) {
            toast.error("Numer PESEL musi zawierać 11 cyfr")
            return
        }

        const usersRef = ref(database, 'Users');

        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {

                const users = snapshot.val();
                const matchingUser = Object.keys(users).filter(key => users[key].pesel === pesel);
                if (matchingUser.length !== 0) {

                    getPatientDataFromDatabase(matchingUser[0])
                } else {
                    setSearchPatient(false);
                    toast.error("Brak pacjenta o podanym numerze PESEL")
                    return null;
                }
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        });
    }

    const getPatientDataFromDatabase = (patientId) => {
        const patientRef = ref(database, `Users/${patientId}`);

        get(patientRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setPatientData([snapshot.val().pesel, snapshot.val().lastName, snapshot.val().firstName, snapshot.val().email])
                    setSearchPatient(true);
                    setPatientId(snapshot.val().id)
                }
            })
            .catch((error) => {
                console.error("Błąd pobierania danych:", error);
            });
    }

    const checkIfAlreadyPatient = async (patientId) => {
        const patientsRef = ref(database, 'Patients');

        await get(patientsRef).then((snapshot) => {
            if (snapshot.exists()) {

                const patients = snapshot.val();
                const matchingPatient = Object.keys(patients).filter(key => patients[key].patient === patientId && patients[key].doctor === uid);
                if (matchingPatient.length !== 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return false;
        });
    }

    return (
        <div>
            <Navbar uid={uid} />
            <div className="Auth-form-container" style={{flexDirection: 'column'}}>

                <div id="background1"></div>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Dodaj nowego pacjenta</h3>
                        <div className="form-group mt-3">
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Wpisz numer PESEL"
                                value={pesel}
                                onChange={(event) => {setPesel(event.target.value)}}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button className="buttonS" onClick={getPatientFromDatabase} type="button">
                                Wyszukaj
                            </button>
                        </div>
                    </div>
                </form>
                <div className="table" style={{display: searchPatient === true ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <TableContainer component={Paper} style={{width: '800px'}}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Numer PESEL</TableCell>
                                    <TableCell align="right">Nazwisko</TableCell>
                                    <TableCell align="right">Imię</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.pesel}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {row.pesel}
                                        </TableCell>
                                        <TableCell align="right">{row.lastName}</TableCell>
                                        <TableCell align="right">{row.firstName}</TableCell>
                                        <TableCell align="right">{row.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button className="buttonS" onClick={addPatient} type="button" style={{width: '100px', margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        Dodaj
                    </button>
                </div>
                <div id="background2"></div>
            </div>
        </div>
    );
};

export default AddPatient;