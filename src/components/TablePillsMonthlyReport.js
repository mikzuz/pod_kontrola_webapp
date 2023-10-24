import React, { useEffect, useState } from "react";
import "../TablePillsMonthlyReport.css";
import { useParams } from "react-router-dom";
import { equalTo, onValue, orderByChild, query, ref, get } from "firebase/database";
import { database } from "./firebase-config";
import Navbar from "./Navbar";

const TablePillsMonthlyReport = () => {
    const { patientId } = useParams();
    const { selectedPillId, selectedMonth } = useParams();
    const [occurrenceCount, setOccurrenceCount] = useState({});
    const [maxDaily, setMaxDaily] = useState(0); // Inicjalizacja jako liczba

    const months = {
        'Styczeń': '01',
        'Luty': '02',
        'Marzec': '03',
        'Kwiecień': '04',
        'Maj': '05',
        'Czerwiec': '06',
        'Lipiec': '07',
        'Sierpień': '08',
        'Wrzesień': '09',
        'Październik': '10',
        'Listopad': '11',
        'Grudzień': '12',
    };

    useEffect(() => {
        if (selectedPillId) {
            const pillsRef = ref(database, 'Pills_status');

            const userStatsQueryByPacient = query(pillsRef, orderByChild('user'), equalTo(patientId));
            const userStatsQueryById = query(pillsRef, orderByChild('id'), equalTo(selectedPillId));

            Promise.all([
                get(userStatsQueryByPacient),
                get(userStatsQueryById)
            ])
                .then((results) => {
                    const statsByPacient = results[0].val() || {};
                    const statsById = results[1].val() || {};
                    const combinedStats = { ...statsByPacient, ...statsById };
                    const statsArray = Object.values(combinedStats);

                    // Wywołaj funkcję countOccurrences po zakończeniu pobierania danych
                    countOccurrences(statsArray);
                })
                .catch((error) => {
                    // Obsłuż błąd
                    console.error("Błąd pobierania danych: ", error);
                });
        }
    }, [selectedPillId, selectedMonth]);

    useEffect(() => {
        if (selectedPillId) {
            const pillsRef = ref(database, 'Pills');

            const userStatsQueryByPacient = query(pillsRef, orderByChild('pacient'), equalTo(patientId));
            const userStatsQueryById = query(pillsRef, orderByChild('id'), equalTo(selectedPillId));

            Promise.all([
                get(userStatsQueryByPacient),
                get(userStatsQueryById)
            ])
                .then((results) => {
                    const statsByPacient = results[0].val() || {};
                    const statsById = results[1].val() || {};
                    const combinedStats = { ...statsByPacient, ...statsById };
                    const statsArray = Object.values(combinedStats);

                    // Wywołaj funkcję countOccurrences po zakończeniu pobierania danych
                    countMaxDaily(statsArray);
                })
                .catch((error) => {
                    // Obsłuż błąd
                    console.error("Błąd pobierania danych: ", error);
                });
        }
    }, [selectedPillId, selectedMonth]);

    const countMaxDaily = (data) => {
        const timeListLength = data
            .filter((item) => item.id === selectedPillId)
            .map((item) => item.time_list.length);

        if (timeListLength.length > 0) {
            setMaxDaily(timeListLength[0]);
        }
    };

    const countOccurrences = (data) => {
        const occurrenceCount = {};

        const monthKey = months[selectedMonth];

        data.forEach((item) => {
            const date = item.date;
            const pillId = item.id;
            const entryMonth = date.split("-")[1]; // Wyciągnięcie miesiąca z daty

            if (pillId === selectedPillId && entryMonth === monthKey) {
                if (occurrenceCount[date]) {
                    occurrenceCount[date] += 1;
                } else {
                    occurrenceCount[date] = 1;
                }
            }
        });

        setOccurrenceCount(occurrenceCount);
    };

    return (
        <div>
            <Navbar/>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col" className="header-cell">Lp</th>
                    <th scope="col" className="header-cell">Data</th>
                    <th scope="col" className="header-cell">Liczba wziętych tabletek</th>
                    <th scope="col" className="header-cell">Liczba planowanych tabletek</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(occurrenceCount).map((date, index) => (
                    <tr key={index}>
                        <th className="center-cell" scope="row">{index + 1}</th>
                        <td className="center-cell">{date}</td>
                        <td className="center-cell">{occurrenceCount[date]}</td>
                        <td className="center-cell">{maxDaily}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablePillsMonthlyReport;
