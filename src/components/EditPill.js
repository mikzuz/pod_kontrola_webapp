import React, {useEffect, useState} from "react";
import { database} from './firebase-config';
import {useNavigate, useParams} from "react-router-dom";
import "../Auth.css";
import {get, ref, set, update} from "firebase/database";
import Navbar from "./Navbar";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import styled from 'styled-components';
import "./AddPill.css";
import {Button, ButtonGroup, IconButton} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const EditPill = () => {

    const StyledMobileTimePicker = styled(MobileTimePicker)`
      border-radius: 6px;
      font-size: 1rem;
      background-color: white;
      border-radius: 6px;
      overflow: hidden;
      width: 320px;
      margin-bottom: 0.5em !important;
      `;

    const daysOfWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const defaultTime = dayjs('2022-04-17T15:30');
    const navigate = useNavigate();
    const { uid } = useParams();
    let { patientId } = useParams();
    let { selectedPillId } = useParams();
    const [name, setName] = useState("");
    const [time1, setTime1] = useState(dayjs('2022-04-17T15:30'));
    const [time2, setTime2] = useState(dayjs('2022-04-17T15:30'));
    const [time3, setTime3] = useState(dayjs('2022-04-17T15:30'));
    const [time, setTime] = useState([time1, time2, time3]);
    const [frequency, setFrequency] = useState("");
    const [amountLeft, setAmountLeft] = useState("");
    const [amountInBox, setAmountInBox] = useState("");
    const [timesToShow, setTimesToShow] = useState(0);
    const [chooseHours, setChooseHours] = useState("Wybierz godziny przypomnień");
    const [timeMonday, setTimeMonday] = useState([]);
    const [timeTuesday, setTimeTuesday] = useState([]);
    const [timeWednesday, setTimeWednesday] = useState([]);
    const [timeThursday, setTimeThursday] = useState([]);
    const [timeFriday, setTimeFriday] = useState([]);
    const [timeSaturday, setTimeSaturday] = useState([]);
    const [timeSunday, setTimeSunday] = useState([]);
    const [customTime, setCustomTime] = useState(false);
    const [data, setData] = useState([]);

    async function getData() {
        const response = await sendHttpRequest()
        setData(response)
    }

    useEffect(() => {
        getData()
    }, []);

    const sendHttpRequest = async () => {
        try {
            const response = await fetch(`http://192.168.0.100:5000/get`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                return data.result.map(item => item.toString());
            } else {
                console.error(`Error: ${response.status}`);
                return [];
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    };

    const handleNameChange = (event, newValue) => {
        setName(newValue);
    };

    const handleInputChange = (event, newInputValue) => {
        setName(newInputValue);
    };

    useEffect(() => {
        setTime([time1, time2, time3]);
    }, [time1, time2, time3]);

    useEffect(() => {
        getPill();
    }, []);

    const getPill = async () => { // DONE
        const pillsRef = ref(database, `Pills/${selectedPillId}`);

        get(pillsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const pill = snapshot.val();
                    setValues(pill);
            } else {
                toast.error("Wystąpił błąd przy pobieraniu danych")
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        });
    }

    const setValues = (pill) => { // DONE
        setName(pill.name)
        setAmountInBox(pill.inBox)
        setAmountLeft(pill.availability)
        setFrequency(pill.frequency)

        switch (pill.frequency) {
            case 'Dwa razy dziennie':
                setTimesToShow(2);
                setTime1(dayjs(`2022-04-17T${pill.time_list[0][0]}`));
                setTime2(dayjs(`2022-04-17T${pill.time_list[1][0]}`));
                break;
            case 'Trzy razy dziennie':
                setTimesToShow(3);
                setTime1(dayjs(`2022-04-17T${pill.time_list[0][0]}`));
                setTime2(dayjs(`2022-04-17T${pill.time_list[1][0]}`));
                setTime3(dayjs(`2022-04-17T${pill.time_list[2][0]}`));
                break;
            case 'Niestandardowa':
                setTimesToShow(0);
                setCustomTime(true)
                setChooseHours("Dodaj godziny przypomnień w wybrane dni")

                pill.time_list.forEach((dayTimes, index) => {
                    let dayTimeList = setTimeFromDatabase(pill, index);
                    switch (dayTimes.day) {
                        case 'Poniedziałek':
                            setTimeMonday(dayTimeList)
                            break;
                        case 'Wtorek':
                            setTimeTuesday(dayTimeList)
                            break;
                        case 'Środa':
                            setTimeWednesday(dayTimeList)
                            break;
                        case 'Czwartek':
                            setTimeThursday(dayTimeList)
                            break;
                        case 'Piątek':
                            setTimeFriday(dayTimeList)
                            break;
                        case 'Sobota':
                            setTimeSaturday(dayTimeList)
                            break;
                        default:
                            setTimeSunday(dayTimeList)
                            break;
                    }
            })
                break;
            default:
                setTimesToShow(1);
                setTime1(dayjs(`2022-04-17T${pill.time_list[0][0]}`));
                break;
        }
    };

    const setTimeFromDatabase = (pill, index) => {
        let timeList = [];
        pill.time_list[index].times.forEach((time) => {
            timeList.push(dayjs(`2023-01-01 ${time[0]}`));
        });
        return timeList;
    };

    const handleEdit = () => { // DONE
        if(name === '') {
            toast.error("Nazwa nie może być pusta");
            return;
        } else if (isNaN(parseInt(amountLeft))) {
            toast.error("Ilość tabletek w opakowaniu musi być liczbą");
            return;
        } else if (amountInBox < 0) {
            toast.error("Ilość tabletek w opakowaniu musi być dodatnia");
            return;
        } else if (amountLeft < 0) {
            toast.error("Ilość pozostałych tabletek musi być dodatnia");
            return;
        } else if (amountLeft > amountInBox) {
            toast.error("Ilość pozostałych tabletek musi być większa od liczby tabletek w opakowaniu");
            return;
        }

        getPillFromDatabase()
    };

    const editPill = async () => { // TO DO
        const times = getTimeTable();
        const date = dayjs().format('YYYY-MM-DD');
        let date_next;

        switch (frequency) {
            case 'Raz w tygodniu':
                date_next = dayjs().add(7, 'day').format('YYYY-MM-DD');
                break;
            case 'Co drugi dzień':
                date_next = dayjs().add(2, 'day').format('YYYY-MM-DD');
                break;
            case 'Niestandardowa':
                const daysByUser = checkDaysOfWeek();
                const currentDayName = getWeekday();
                let currentDayIndex = -1;
                let nextDayIndex = -1;
                for(let i = 0; i < daysOfWeek.length; i++) {
                    if (daysOfWeek[i] === currentDayName) {
                        currentDayIndex = i
                    }
                }
                for(let i = currentDayIndex + 1; i < daysByUser.length; i++) {
                    if (daysByUser[i] !== 'null') {
                        nextDayIndex = i
                    }
                }
                if (nextDayIndex === -1) {
                    for(let i = 0; i < currentDayIndex; i++) {
                        if (daysByUser[i] !== 'null') {
                            nextDayIndex = i
                        }
                    }
                }
                date_next = dayjs(getNextDate(nextDayIndex)).format('YYYY-MM-DD');
                break;
            default:
                date_next = date;
                break;
        }

        try {
            if (frequency === 'Niestandardowa') {
                let timeList = [getTimeTableForDays(timeSunday), getTimeTableForDays(timeMonday), getTimeTableForDays(timeTuesday), getTimeTableForDays(timeWednesday), getTimeTableForDays(timeThursday), getTimeTableForDays(timeFriday), getTimeTableForDays(timeSaturday)];
                const customTimeList = [];
                daysOfWeek.forEach((day, index) => {
                    if (timeList[index].length > 0) {
                        const dayObject = {
                            day: day,
                            times: [],
                        };

                        dayObject.times = timeList[index];
                        customTimeList.push(dayObject);
                    }
                });

                await set(ref(database, 'Pills/' + selectedPillId), {
                    name: name,
                    id: selectedPillId,
                    inBox: parseInt(amountLeft),
                    availability: parseInt(amountLeft),
                    date_last: date,
                    date_next: date_next,
                    frequency: frequency,
                    time_list: customTimeList,
                    pacient: patientId,
                })
            } else {
                await set(ref(database, 'Pills/' + selectedPillId), {
                    name: name,
                    id: selectedPillId,
                    inBox: parseInt(amountLeft),
                    availability: parseInt(amountLeft),
                    date_last: date,
                    date_next: date_next,
                    frequency: frequency,
                    time_list: times,
                    pacient: patientId,
                })
            }
            toast.success("Edytowano lek");
            navigate(`/pillsList/${uid}/${patientId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getWeekday = () => {
        var currentDate = new Date();
        var weekday = currentDate.getDay();
        var dayName = daysOfWeek[weekday];
        return dayName;
    }

    const checkDaysOfWeek = () => {
        var daysOfWeek = [];
        timeSunday.length > 0 ? daysOfWeek.push("Niedziela") : daysOfWeek.push("null");
        timeMonday.length > 0 ? daysOfWeek.push("Poniedziałek") : daysOfWeek.push("null");
        timeTuesday.length > 0 ? daysOfWeek.push("Wtorek") : daysOfWeek.push("null");
        timeWednesday.length > 0 ? daysOfWeek.push("Środa") : daysOfWeek.push("null");
        timeThursday.length > 0 ? daysOfWeek.push("Czwartek") : daysOfWeek.push("null");
        timeFriday.length > 0 ? daysOfWeek.push("Piątek") : daysOfWeek.push("null");
        timeSaturday.length > 0 ? daysOfWeek.push("Sobota") : daysOfWeek.push("null");
        return daysOfWeek;
    }

    const getNextDate = (targetDay) => {
        var today = new Date();
        var currentDayOfWeek = today.getDay();
        var daysUntilTarget = (targetDay - currentDayOfWeek + 7) % 7;
        today.setDate(today.getDate() + daysUntilTarget);
        return today;
    }

    const getPillFromDatabase = async () => { // ZOSTAJE
        const pillsRef = ref(database, 'Pills');

        get(pillsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const pills = snapshot.val();
                const matchingPill = Object.keys(pills).filter(key => pills[key].name === name);
                if (matchingPill.length > 1) {
                    toast.error("Pacjent ma już na swojej liście dany lek")
                } else {
                    editPill();
                }
            }
        }).catch((error) => {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        });
    }

    const getTimeTable = () => { // ZOSTAJE
        return [...Array(timesToShow)].map((_, index) => (
            [time[index].format('HH:mm'), false]
        ));
    };

    const getTimeTableForDays = (day) => {
        return day.map((_, index) => (
            [day[index].format('HH:mm'), false]
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
            case 'Niestandardowa':
                setCustomTime(true)
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
        setCustomTime(false)
    };

    const handleTimeChange = (newTime, index) => { // ZOSTAJE
        if (index === 0) {
            setTime1(newTime)
        } else if (index === 1) {
            setTime2(newTime)
        } else if (index === 2) {
            setTime3(newTime)
        }
    };

    const handleTimeChangeMonday = (newTime, index) => {
        const newTimes = [...timeMonday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeMonday(newTimes);
    };

    const handleTimeChangeTuesday = (newTime, index) => {
        const newTimes = [...timeTuesday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeTuesday(newTimes);
    };

    const handleTimeChangeWednesday = (newTime, index) => {
        const newTimes = [...timeWednesday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeWednesday(newTimes);
    };

    const handleTimeChangeThursday = (newTime, index) => {
        const newTimes = [...timeThursday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeThursday(newTimes);
    };

    const handleTimeChangeFriday = (newTime, index) => {
        const newTimes = [...timeFriday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeFriday(newTimes);
    };

    const handleTimeChangeSaturday = (newTime, index) => {
        const newTimes = [...timeSaturday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeSaturday(newTimes);
    };

    const handleTimeChangeSunday = (newTime, index) => {
        const newTimes = [...timeSunday];
        if (index === 0) {
            newTimes[0] = newTime
        } else if (index === 1) {
            newTimes[1] = newTime
        } else if (index === 2) {
            newTimes[2] = newTime
        }
        setTimeSunday(newTimes);
    };

    const checkIfOk = (timesADay) => {
        if (timesADay <= 3) {
            return true
        } else {
            toast.info("Maksymalna dzienna ilość przypomnień wynosi 3");
            return false;
        }

    };

    const addMonday = () => {
        const newTimes = [...timeMonday];
        if (checkIfOk(timeMonday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeMonday(newTimes)
        }
    };

    const addTuesday = () => {
        const newTimes = [...timeTuesday];
        if (checkIfOk(timeTuesday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeTuesday(newTimes)
        }
    };

    const addWednesday = () => {
        const newTimes = [...timeWednesday];
        if (checkIfOk(timeWednesday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeWednesday(newTimes)
        }
    };

    const addThursday = () => {
        const newTimes = [...timeThursday];
        if (checkIfOk(timeThursday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeThursday(newTimes)
        }
    };

    const addFriday = () => {
        const newTimes = [...timeFriday];
        if (checkIfOk(timeFriday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeFriday(newTimes)
        }
    };

    const addSaturday = () => {
        const newTimes = [...timeSaturday];
        if (checkIfOk(timeSaturday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeSaturday(newTimes)
        }
    };

    const addSunday = () => {
        const newTimes = [...timeSunday];
        if (checkIfOk(timeSunday.length + 1)) {
            newTimes[newTimes.length] = defaultTime;
            setTimeSunday(newTimes)
        }
    };

    const removeTime = (day, indexToRemove) => {
        switch (day) {
            case 'monday':
                setTimeMonday((prevTimeMonday) =>
                    prevTimeMonday.filter((_, index) => index !== indexToRemove)
                );
                break;
            case 'tuesday':
                setTimeTuesday((prevTimeTuesday) =>
                    prevTimeTuesday.filter((_, index) => index !== indexToRemove)
                );
                break
            case 'wednesday':
                setTimeWednesday((prevTimeWednesday) =>
                    prevTimeWednesday.filter((_, index) => index !== indexToRemove)
                );
                break;
            case 'thursday':
                setTimeThursday((prevTimeThursday) =>
                    prevTimeThursday.filter((_, index) => index !== indexToRemove)
                );
                break;
            case 'friday':
                setTimeFriday((prevTimeFriday) =>
                    prevTimeFriday.filter((_, index) => index !== indexToRemove)
                );
                break;
            case 'saturday':
                setTimeSaturday((prevTimeSaturday) =>
                    prevTimeSaturday.filter((_, index) => index !== indexToRemove)
                );
                break;
            default:
                setTimeSunday((prevTimeSunday) =>
                    prevTimeSunday.filter((_, index) => index !== indexToRemove)
                );
                break;
        }

    };

    return (
        <div>
            <Navbar uid={uid} />
            <div className="Auth-form-container" style={{flexDirection: 'column'}}>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Edytuj lek</h3>
                        <div className="form-group mt-3" style={{marginBottom: '0.5em'}}>
                            <label>Nazwa leku</label>
                            <Autocomplete
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                options={data.map((option) => option)}
                                value={name}
                                onChange={handleNameChange}
                                onInputChange={handleInputChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <label>Częstotliwość przyjmowania leku</label>
                        <select className="form-control mt-1" value={frequency} onChange={handleDropdownChange}>
                            <option>Codziennie</option>
                            <option>Dwa razy dziennie</option>
                            <option>Trzy razy dziennie</option>
                            <option>Co drugi dzień</option>
                            <option>Raz w tygodniu</option>
                            <option>Niestandardowa</option>
                        </select>
                        <label style={{marginTop: '0.5em',}}>{chooseHours}</label>
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
                        <div className="custom" style={{ display: customTime ? 'block' : 'none'}}>
                            <ButtonGroup variant="text" aria-label="text button group" style={{ display: timesToShow === 0 ? 'block' : 'none', marginBottom: '10px' }}>
                                <Button onClick={addMonday} style={{ color: 'black' }}>Pon</Button>
                                <Button onClick={addTuesday} style={{ color: 'black' }}>Wt</Button>
                                <Button onClick={addWednesday} style={{ color: 'black' }}>Śr</Button>
                                <Button onClick={addThursday} style={{ color: 'black' }}>Czw</Button>
                                <Button onClick={addFriday} style={{ color: 'black' }}>Pt</Button>
                                <Button onClick={addSaturday} style={{ color: 'black' }}>Sob</Button>
                                <Button onClick={addSunday} style={{ color: 'black' }}>Nd</Button>
                            </ButtonGroup>
                            <div className="monday" style={{ display: timeMonday.length > 0 ? 'block' : 'none'}}>
                                <label>Poniedziałek</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeMonday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeMonday(newTime, index)}
                                                value={timeMonday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("monday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="tuesday" style={{ display: timeTuesday.length > 0 ? 'block' : 'none'}}>
                                <label>Wtorek</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeTuesday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeTuesday(newTime, index)}
                                                value={timeTuesday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("tuesday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="wednesday" style={{ display: timeWednesday.length > 0 ? 'block' : 'none'}}>
                                <label>Środa</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeWednesday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeWednesday(newTime, index)}
                                                value={timeWednesday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("wednesday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="thursday" style={{ display: timeThursday.length > 0 ? 'block' : 'none'}}>
                                <label>Czwartek</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeThursday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeThursday(newTime, index)}
                                                value={timeThursday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("thursday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="friday" style={{ display: timeFriday.length > 0 ? 'block' : 'none'}}>
                                <label>Piątek</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeFriday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeFriday(newTime, index)}
                                                value={timeFriday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("friday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="saturday" style={{ display: timeSaturday.length > 0 ? 'block' : 'none'}}>
                                <label>Sobota</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeSaturday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeSaturday(newTime, index)}
                                                value={timeSaturday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("saturday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                            <div className="sunday" style={{ display: timeSunday.length > 0 ? 'block' : 'none'}}>
                                <label>Niedziela</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {timeSunday.map((_, index) => (
                                        <div style={{ display: 'inline-flex'}}>
                                            <StyledMobileTimePicker
                                                key={index}
                                                ampm={false}
                                                onAccept={(newTime) => handleTimeChangeSunday(newTime, index)}
                                                value={timeSunday[index]}
                                                style={{width: '280px'}}
                                            />
                                            <IconButton onClick={() => removeTime("sunday", index)} style={{ color: 'white', width: '40px', height: '40px' }}>
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="form-group mt-3" style={{marginBottom: '0.5em'}}>
                            <label>Ilość tabletek w opakowaniu</label>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Ilość tabletek w opakowaniu"
                                value={amountInBox}
                                readOnly
                                onChange={(event) => {setAmountInBox(event.target.value)}}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Pozostała ilość tabletek w opakowaniu</label>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Pozostała ilość tabletek w opakowaniu"
                                value={amountLeft}
                                readOnly
                                onChange={(event) => {setAmountLeft(event.target.value)}}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button className="buttonS" onClick={handleEdit} type="button">
                                Edytuj
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPill;