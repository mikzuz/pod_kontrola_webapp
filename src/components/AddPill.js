import React, {useEffect, useState} from "react";
import { database} from './firebase-config';
import {useNavigate, useParams} from "react-router-dom";
import "../Auth.css";
import {get, ref, set} from "firebase/database";
import Navbar from "./Navbar";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import styled from 'styled-components';
import "./AddPill.css";
import {Button, ButtonGroup} from "@mui/material";

// npm install @mui/x-date-pickers
// npm install styled-components

const AddPill = () => {

    const StyledMobileTimePicker = styled(MobileTimePicker)`
      border-radius: 6px;
      font-size: 1rem;
      background-color: white;
      border-radius: 6px;
      overflow: hidden;
      width: 320px;
      margin-bottom: 0.5em !important;
      `;

    const navigate = useNavigate();
    const { uid } = useParams();
    let { patientId } = useParams();
    const [name, setName] = useState("");
    const [time1, setTime1] = useState(dayjs('2022-04-17T15:30'));
    const [time2, setTime2] = useState(dayjs('2022-04-17T15:30'));
    const [time3, setTime3] = useState(dayjs('2022-04-17T15:30'));
    const [time, setTime] = useState([time1, time2, time3]);
    const [frequency, setFrequency] = useState("");
    const [amountLeft, setAmountLeft] = useState("");
    const [timesToShow, setTimesToShow] = useState(1);
    const [timesToShowMonday, setTimesToShowMonday] = useState(0);
    const [timesToShowTuesday, setTimesToShowTuesday] = useState(0);
    const [timesToShowWednesday, setTimesToShowWednesday] = useState(0);
    const [timesToShowThursday, setTimesToShowThursday] = useState(0);
    const [timesToShowFriday, setTimesToShowFriday] = useState(0);
    const [timesToShowSaturday, setTimesToShowSaturday] = useState(0);
    const [timesToShowSunday, setTimesToShowSunday] = useState(0);
    const [chooseHours, setChooseHours] = useState("Wybierz godziny przypomnień");

    useEffect(() => {
        setTime([time1, time2, time3]);
    }, [time1, time2, time3]);

    const handleAdd = () => {
        if(name === '') {
            toast.error("Nazwa nie może być pusta");
            return;
        } else if (isNaN(parseInt(amountLeft))) {
            toast.error("Ilość tabletek w opakowaniu musi być liczbą");
            return;
        } else if (amountLeft < 0) {
            toast.error("Ilość tabletek w opakowaniu musi być dodatnia");
            return;
        }

        getPillFromDatabase()
    };

    const addPill = async () => {
        const times = getTimeTable();
        const id = new Date().getTime().toString();
        const date = dayjs().format('YYYY-MM-DD');
        let date_next;

        switch (frequency) {
            case 'Raz w tygodniu':
                date_next = dayjs().add(7, 'day').format('YYYY-MM-DD');
                break;
            case 'Co drugi dzień':
                date_next = dayjs().add(2, 'day').format('YYYY-MM-DD');
                break;
            default:
                date_next = date;
                break;
        }

        try {
            await set(ref(database, 'Pills/' + id), {
                name: name,
                id: id,
                inBox: amountLeft,
                availability: amountLeft,
                date_last: date,
                date_next: date_next,
                frequency: frequency,
                time_list: times,
                pacient: patientId,
            })
            toast.success("Dodano lek"); //nwm czemu nie widać
            navigate(`/pillsList/${uid}/${patientId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getPillFromDatabase = async () => {
        const pillsRef = ref(database, 'Pills');

        get(pillsRef).then((snapshot) => {
            if (snapshot.exists()) {

                const pills = snapshot.val();
                const matchingPill = Object.keys(pills).filter(key => pills[key].name === name);
                if (matchingPill.length !== 0) {
                    toast.error("Pacjent ma już na swojej liście dany lek")
                } else {
                    addPill();
                }
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        });
    }

    const getTimeTable = () => {
        return [...Array(timesToShow)].map((_, index) => (
            [time[index].format('HH:mm'), false]
        ));
    };

    const handleDropdownChange = (event) => {
        const newFrequency = event.target.value;
        setFrequency(newFrequency);

        switch (newFrequency) {
            case 'Dwa razy dziennie':
                setTimesToShow(2);
                cleanBoard()
                break;
            case 'Trzy razy dziennie':
                setTimesToShow(3);
                cleanBoard()
                break
            case 'Niestandardowe':
                setTimesToShow(0);
                setChooseHours("Dodaj godziny przypomnień w wybrane dni")
                break;
            default:
                setTimesToShow(1);
                cleanBoard()
                break;
        }
    }

    const cleanBoard = () => {
        setChooseHours("Wybierz godziny przypomnień")
        setTimesToShowMonday(0)
    };

    const handleTimeChange = (newTime, index) => {
        if (index === 0) {
            setTime1(newTime)
        } else if (index === 1) {
            setTime2(newTime)
        } else if (index === 2) {
            setTime3(newTime)
        }
    };

    const addMonday = () => {
        let monday = timesToShowMonday
        setTimesToShowMonday(monday + 1)
    };

    const addTuesday = () => {
        let tuesday = timesToShowTuesday
        setTimesToShowTuesday(tuesday + 1)
    };

    const addWednesday = () => {
        let wednesday = timesToShowWednesday
        setTimesToShowWednesday(wednesday + 1)
    };

    const addThursday = () => {
        let thursday = timesToShowThursday
        setTimesToShowThursday(thursday + 1)
    };

    const addFriday = () => {
        let friday = timesToShowFriday
        setTimesToShowFriday(friday + 1)
    };

    const addSaturday = () => {
        let saturday = timesToShowSaturday
        setTimesToShowSaturday(saturday + 1)
    };

    const addSunday = () => {
        let sunday = timesToShowSunday
        setTimesToShowSunday(sunday + 1)
    };

    return (
        <div>
            <Navbar uid={uid} />
            <div className="Auth-form-container" style={{flexDirection: 'column'}}>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Dodaj nowy lek</h3>
                        <div className="form-group mt-3" style={{marginBottom: '0.5em'}}>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Nazwa leku"
                                value={name}
                                onChange={(event) => {setName(event.target.value)}}
                            />
                        </div>
                        <label>Wybierz częstotliwość przyjmowania leku</label>
                        <select className="form-control mt-1" value={frequency} onChange={handleDropdownChange}>
                            <option>Codziennie</option>
                            <option>Dwa razy dziennie</option>
                            <option>Trzy razy dziennie</option>
                            <option>Co drugi dzień</option>
                            <option>Raz w tygodniu</option>
                            <option>Niestandardowe</option>
                        </select>
                        <label style={{ marginTop: '0.5em' }}>{chooseHours}</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {[...Array(timesToShow)].map((_, index) => (
                                <StyledMobileTimePicker
                                    key={index}
                                    ampm={false}
                                    onAccept={(newTime) => handleTimeChange(newTime, index)}
                                    value={time[index]}
                                />
                            ))}
                        </LocalizationProvider>
                        <ButtonGroup variant="text" aria-label="text button group" style={{ display: timesToShow === 0 ? 'block' : 'none', marginBottom: '10px' }}>
                            <Button onClick={addMonday} style={{ color: 'black' }}>Pon</Button>
                            <Button onClick={addTuesday} style={{ color: 'black' }}>Wt</Button>
                            <Button onClick={addWednesday} style={{ color: 'black' }}>Śr</Button>
                            <Button onClick={addThursday} style={{ color: 'black' }}>Czw</Button>
                            <Button onClick={addFriday} style={{ color: 'black' }}>Pt</Button>
                            <Button onClick={addSaturday} style={{ color: 'black' }}>Sob</Button>
                            <Button onClick={addSunday} style={{ color: 'black' }}>Nd</Button>
                        </ButtonGroup>
                        <div className="monday" style={{ display: timesToShowMonday > 0 ? 'block' : 'none'}}>
                            <label>Poniedziałek</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowMonday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="tuesday" style={{ display: timesToShowTuesday > 0 ? 'block' : 'none'}}>
                            <label>Wtorek</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowTuesday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="wednesday" style={{ display: timesToShowWednesday > 0 ? 'block' : 'none'}}>
                            <label>Środa</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowWednesday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="thursday" style={{ display: timesToShowThursday > 0 ? 'block' : 'none'}}>
                            <label>Czwartek</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowThursday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="friday" style={{ display: timesToShowFriday > 0 ? 'block' : 'none'}}>
                            <label>Piątek</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowFriday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="saturday" style={{ display: timesToShowSaturday > 0 ? 'block' : 'none'}}>
                            <label>Sobota</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowSaturday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="sunday" style={{ display: timesToShowSunday > 0 ? 'block' : 'none'}}>
                            <label>Niedziela</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {[...Array(timesToShowSunday)].map((_, index) => (
                                    <StyledMobileTimePicker
                                        key={index}
                                        ampm={false}
                                        onAccept={(newTime) => handleTimeChange(newTime, index)}
                                        value={time[index]}
                                    />
                                ))}
                            </LocalizationProvider>
                        </div>
                        <div className="form-group mt-3">
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Ilość tabletek w opakowaniu"
                                value={amountLeft}
                                onChange={(event) => {setAmountLeft(event.target.value)}}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button className="buttonS" onClick={handleAdd} type="button">
                                Dodaj
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPill;