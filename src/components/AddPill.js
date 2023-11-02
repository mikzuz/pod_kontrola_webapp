import React, {useState} from "react";
import { database} from './firebase-config';
import {useNavigate, useParams} from "react-router-dom";
import "../Auth.css";
import {get, ref, set} from "firebase/database";
import Navbar from "./Navbar";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddPill = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    let { patientId } = useParams();
    const [name, setName] = useState("");
    const [time, setTime] = useState("");
    const [frequency, setFrequency] = useState("");
    const [amountLeft, setAmountLeft] = useState("");

    const addPill = async () => {
        const id = new Date().getTime().toString();
        const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`;

        try {
            await set(ref(database, 'Pills/' + id), {
                name: name,
                id: id,
                inBox: amountLeft,
                availability: amountLeft,
                date_last: date,
                date_next: date,
                frequency: frequency,
                time_list: [["10:00", false]],
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

    const handleDropdownChange = (event) => {
        setFrequency(event.target.value);
    }

    return (
        <div>
            <Navbar uid={uid} />
            <div className="Auth-form-container" style={{flexDirection: 'column'}}>
                <div id="background1"></div>
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Dodaj nowy lek</h3>
                        <div className="form-group mt-3">
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Nazwa leku"
                                value={name}
                                onChange={(event) => {setName(event.target.value)}}
                            />
                        </div>
                        <label>Wybierz częstotliwość przyjmowania laku</label>
                        <select className="form-control mt-1" value={frequency} onChange={handleDropdownChange}>
                            <option>Codziennie</option>
                            <option>Dwa razy dziennie</option>
                            <option>Trzy razy dziennie</option>
                            <option>Co drugi dzień</option>
                            <option>Raz w tygodniu</option>
                        </select>
                        <div className="form-group mt-3">
                            <label>Godziny przypomnień</label>
                            <input
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Nazwa leku"
                                value={time}
                                onChange={(event) => {setTime(event.target.value)}}
                            />
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
                            <button className="buttonS" onClick={getPillFromDatabase} type="button">
                                Dodaj
                            </button>
                        </div>
                    </div>
                </form>
                <div id="background2"></div>
            </div>
        </div>
    );
};

export default AddPill;