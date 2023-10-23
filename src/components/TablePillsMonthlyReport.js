import React, { useEffect, useState } from "react";
import "../TablePillsMonthlyReport.css";
import { useParams } from "react-router-dom";
import { equalTo, onValue, orderByChild, query, ref, get } from "firebase/database";
import { database } from "./firebase-config";

const TablePillsMonthlyReport = () => {
    const { selectedPillId } = useParams();
    const [pillsData, setPillsData] = useState([]);
    const [occurrenceCount, setOccurrenceCount] = useState({});
    const [maxDaily, setMaxDaily] = useState(0); // Inicjalizacja jako liczba


    useEffect(() => {
        if (selectedPillId) {
            const pillsRef = ref(database, 'Pills_status');

            const userStatsQueryByPacient = query(pillsRef, orderByChild('user'), equalTo('qjETQt3F6qgSuKTSZtmBv10MJmY2'));
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

                    console.log(statsArray)

                    // Wywołaj funkcję countOccurrences po zakończeniu pobierania danych
                    countOccurrences(statsArray);
                })
                .catch((error) => {
                    // Obsłuż błąd
                    console.error("Błąd pobierania danych: ", error);
                });
        }
    }, [selectedPillId]);

    useEffect(() => {
        if (selectedPillId) {
            const pillsRef = ref(database, 'Pills');

            const userStatsQueryByPacient = query(pillsRef, orderByChild('pacient'), equalTo('qjETQt3F6qgSuKTSZtmBv10MJmY2'));
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

                    console.log(statsArray);

                    // Wywołaj funkcję countOccurrences po zakończeniu pobierania danych
                    countMaxDaily(statsArray);
                })
                .catch((error) => {
                    // Obsłuż błąd
                    console.error("Błąd pobierania danych: ", error);
                });
        }
    }, [selectedPillId]);

// Funkcja do wyciągnięcia 'time_list' i obliczenia liczby elementów
    const countMaxDaily = (data) => {
        const timeListLength = data
            .filter((item) => item.id === selectedPillId)
            .map((item) => item.time_list.length);

        if (timeListLength.length > 0) {
            console.log("Liczba elementów w time_list:", timeListLength[0]);
            setMaxDaily(timeListLength[0]);
        }
    };



    // Przenieś funkcję countOccurrences poza useEffect
    const countOccurrences = (data) => {
        const occurrenceCount = {};

        data.forEach((item) => {
            const date = item.date;
            const pillId = item.id;

            console.log(selectedPillId)
            console.log(pillId)

            if (pillId === selectedPillId) {
                if (occurrenceCount[date]) {
                    occurrenceCount[date] += 1;
                } else {
                    occurrenceCount[date] = 1;
                }
            }
        });

        // Zaktualizuj stan occurrenceCount
        setOccurrenceCount(occurrenceCount);
    };

    return (
        <div>

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
                {/* Iteruj przez occurrenceCount i wyświetl wyniki w tabeli */}
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
