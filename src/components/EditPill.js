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
    const [timesToShow, setTimesToShow] = useState(1);

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
            default:
                setTimesToShow(1);
                setTime1(dayjs(`2022-04-17T${pill.time_list[0][0]}`));
                break;
        }
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
            default:
                date_next = date;
                break;
        }

        try {
            await update(ref(database, 'Pills/' + selectedPillId), {
                name: name,
                id: selectedPillId,
                inBox: amountInBox,
                availability: amountLeft,
                date_last: date,
                date_next: date_next,
                frequency: frequency,
                time_list: times,
                pacient: patientId,
            })
            toast.success("Edytowano lek"); //nwm czemu nie widać
            navigate(`/pillsList/${uid}/${patientId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

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

    const handleDropdownChange = (event) => { // ZOSTAJE
        const newFrequency = event.target.value;
        setFrequency(newFrequency);

        switch (newFrequency) {
            case 'Dwa razy dziennie':
                setTimesToShow(2);
                break;
            case 'Trzy razy dziennie':
                setTimesToShow(3);
                break;
            default:
                setTimesToShow(1);
                break;
        }
    }

    const handleTimeChange = (newTime, index) => { // ZOSTAJE
        if (index === 0) {
            setTime1(newTime)
        } else if (index === 1) {
            setTime2(newTime)
        } else if (index === 2) {
            setTime3(newTime)
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
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Nazwa leku"
                                value={name}
                                onChange={(event) => {setName(event.target.value)}}
                            />
                        </div>
                        <label>Częstotliwość przyjmowania leku</label>
                        <select className="form-control mt-1" value={frequency} onChange={handleDropdownChange}>
                            <option>Codziennie</option>
                            <option>Dwa razy dziennie</option>
                            <option>Trzy razy dziennie</option>
                            <option>Co drugi dzień</option>
                            <option>Raz w tygodniu</option>
                        </select>
                        <label style={{marginTop: '0.5em',}}>Wybierz godziny przypomnień</label>
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
                        <div className="form-group mt-3" style={{marginBottom: '0.5em'}}>
                            <label>Ilość tabletek w opakowaniu</label>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Ilość tabletek w opakowaniu"
                                value={amountInBox}
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