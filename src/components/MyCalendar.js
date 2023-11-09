import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pl'; // Import polskiego tłumaczenia moment.js
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useParams } from 'react-router-dom';
import { equalTo, get, orderByChild, query, ref } from 'firebase/database';
import { database } from './firebase-config';
import Navbar from "./Navbar";
import './MyCalendar.css';


moment.locale('pl'); // Ustawienie moment.js na język polski

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const { uid } = useParams();
    const { patientId } = useParams();
    const { selectedPillId, selectedMonth } = useParams();
    const [occurrenceCount, setOccurrenceCount] = useState({});
    const [maxDaily, setMaxDaily] = useState(0); // Inicjalizacja jako liczba
    const [pillsInfo, setPillsInfo] = useState([]);
    const [pillsStatus, setPillsStatus] = useState([]);
    // const [calendarEvents, setCalendarEvents] = useState([]);

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

                    setPillsInfo(statsArray);
                })
                .catch((error) => {
                    console.error("Błąd pobierania danych: ", error);
                });
        }
    }, [selectedPillId, selectedMonth]);

    useEffect(() => {
        if (pillsInfo.length > 0) {
            countMaxDaily(pillsInfo);
        }
    }, [pillsInfo]);

    const countMaxDaily = (data) => {
        const timeListLength = data
            .filter((item) => item.id === selectedPillId)
            .map((item) => item.time_list.length);

        if (timeListLength.length > 0) {
            setMaxDaily(timeListLength[0]);
            nextFunc();
        }
    };

    const nextFunc = async () => {
        if (selectedPillId) {
            const pillsRef = ref(database, 'Pills_status');

            const userStatsQueryByPacient = query(pillsRef, orderByChild('user'), equalTo(patientId));
            const userStatsQueryById = query(pillsRef, orderByChild('id'), equalTo(selectedPillId));

            try {
                const [resultsByPacient, resultsById] = await Promise.all([
                    get(userStatsQueryByPacient),
                    get(userStatsQueryById)
                ]);

                const statsByPacient = resultsByPacient.val() || {};
                const statsById = resultsById.val() || {};
                const combinedStats = { ...statsByPacient, ...statsById };
                const statsArray = Object.values(combinedStats);
                setPillsStatus(statsArray);

                // countOccurrences(statsArray);
            } catch (error) {
                console.error("Błąd pobierania danych: ", error);
            }
        }
    };

    console.log(pillsStatus);

    // const countOccurrences = (data) => {
    //     const occurrenceCount = {};
    //     const monthKey = months[selectedMonth];
    //
    //     data.forEach((item) => {
    //         const date = item.date;
    //         const pillId = item.id;
    //         const entryMonth = date.split("-")[1];
    //
    //         if (pillId === selectedPillId && entryMonth === monthKey) {
    //             if (occurrenceCount[date]) {
    //                 occurrenceCount[date] += 1;
    //             } else {
    //                 occurrenceCount[date] = 1;
    //             }
    //         }
    //     });
    //
    //     setOccurrenceCount(occurrenceCount);
    //     updateCalendarEvents(occurrenceCount);
    // };

    // const updateCalendarEvents = (occurrenceCount) => {
    //     const updatedEvents = Object.keys(occurrenceCount).map((date) => {
    //         const selectedPill = pillsInfo.find((item) => item.id === selectedPillId);
    //
    //         if (selectedPill) {
    //             const events = [];
    //
    //             for (let i = 0; i < selectedPill.time_list.length; i++) {
    //                 const eventTime = selectedPill.time_list[i][0];
    //                 const eventDate = new Date(date);
    //                 eventDate.setHours(eventTime.split(":")[0]);
    //                 eventDate.setMinutes(eventTime.split(":")[1]);
    //
    //                 events.push({
    //                     title: selectedPill.name || 'Unknown',
    //                     start: eventDate,
    //                     end: eventDate,
    //                     desc: `Occurrence: ${occurrenceCount[date]}`,
    //                 });
    //             }
    //
    //             return events;
    //         }
    //
    //         return null;
    //     });
    //
    //     const newEvents = updatedEvents.flat().filter(Boolean);
    //     console.log(newEvents);
    //     setCalendarEvents(newEvents);
    // };

    const createCalendarEvents = (pillsStatus) => {
        const events = pillsStatus
            .filter((item) => item.id === selectedPillId && item.status === "true" && item.date)
            .map((item) => {
                const dateParts = item.date?.split("-");
                const timeParts = item.time?.split(":");

                console.log(timeParts);

                if (dateParts.length === 3 && timeParts.length === 2) {
                    const year = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1;
                    const day = parseInt(dateParts[2], 10);
                    const hour = parseInt(timeParts[0], 10);
                    const minute = parseInt(timeParts[1], 10);

                    const eventDate = new Date(year, month, day, hour, minute);
                    const matchingPillInfo = pillsInfo.find((info) => info.id.toString() === item.id.toString());

                    console.log("matchingPillInfo:", matchingPillInfo);
                    console.log("eventDate:", eventDate);

                    // const eventName = `${item.time} ${matchingPillInfo ? matchingPillInfo.name : 'Unknown'}`;


                    return {
                        title: matchingPillInfo ? matchingPillInfo.name : 'Unknown',
                        start: eventDate,
                        end: eventDate,
                    };
                }

                return null;
            })
            .filter((event) => event !== null);

        return events;
    };

    const calculateFrequency = () => {
        if (!selectedPillId || !pillsInfo.length) {
            return 0;
        }

        const selectedPill = pillsInfo.find((item) => item.id === selectedPillId);

        if (!selectedPill || !selectedPill.date_last || !selectedPill.date_next) {
            return 0;
        }

        const dateLast = moment(selectedPill.date_last, 'YYYY-MM-DD');
        const dateNext = moment(selectedPill.date_next, 'YYYY-MM-DD');

        // Sprawdź, czy date_last i date_next są takie same
        if (dateLast.isSame(dateNext, 'day')) {
            return 1;
        }

        const daysDifference = dateNext.diff(dateLast, 'days');
        const frequency = 1 / daysDifference;

        return frequency;
    };

// Użycie funkcji
    useEffect(() => {
        const frequency = calculateFrequency();
        console.log('Frequency:', frequency);
    }, [selectedPillId, pillsInfo]);






    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        if (pillsStatus.length > 0 && pillsInfo.length > 0) {
            const events = createCalendarEvents(pillsStatus);
            console.log("events");
            console.log(events);
            setCalendarEvents(events);
        }
    }, [pillsStatus, pillsInfo]);





    const getFirstDayOfMonth = (selectedMonth) => {
        const currentYear = new Date().getFullYear();
        const selectedMonthIndex = Object.keys(months).indexOf(selectedMonth);
        const startDate = new Date(currentYear, selectedMonthIndex, 1);
        return startDate;
    };

    return (
        <div>
        <Navbar uid={uid} />
            <div style={{ height: 500, marginTop: 20 }}>
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    defaultDate={getFirstDayOfMonth(selectedMonth)} // Ustawienie daty na pierwszy dzień wybranego miesiąca
                    views={['month', 'week', 'day']}
                    selectable
                    messages={{
                        next: 'Następny',
                        previous: 'Poprzedni',
                        today: 'Dziś',
                        month: 'Miesiąc',
                        week: 'Tydzień',
                        day: 'Dzień',
                    }}
                />
        </div>
        </div>
    );

};


export default MyCalendar;
