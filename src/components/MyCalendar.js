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

const Legend = () => (
    <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'green',
                    marginRight: '5px',
                    marginBottom: '5px',
                }}
            />
            <span>Tabletka wzięta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'lightgray',
                    marginRight: '5px',
                }}
            />
            <span>Planowana</span>
        </div>
    </div>
);

const MyCalendar = () => {
    const { uid } = useParams();
    const { patientId } = useParams();
    const { selectedPillId, selectedMonth } = useParams();
    const [occurrenceCount, setOccurrenceCount] = useState({});
    const [maxDaily, setMaxDaily] = useState(0); // Inicjalizacja jako liczba
    const [pillsInfo, setPillsInfo] = useState([]);
    const [pillsStatus, setPillsStatus] = useState([]);
    const [frequency, setFrequency] = useState(0);

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

    const createCalendarEvents = (pillsStatus) => {
        const currentDate = new Date();

        const selectedPill = pillsInfo.find((info) => info.id === selectedPillId);

        if (selectedPill && selectedPill.time_list.length > 0) {
            const dateLast = moment(selectedPill.date_last, 'YYYY-MM-DD');
            const dateNext = moment(selectedPill.date_next, 'YYYY-MM-DD');

            let daysDifference = dateNext.diff(dateLast, 'days');
            if (daysDifference === 0) {
                daysDifference = 1;
            }

            const events = pillsStatus
                .filter((item) => item.id === selectedPillId && item.status === "true" && item.date)
                .map((item) => {
                    const dateParts = item.date?.split("-");
                    const timeParts = item.time?.split(":");

                    if (dateParts.length === 3 && timeParts.length === 2) {
                        const year = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10) - 1;
                        const day = parseInt(dateParts[2], 10);
                        const hour = parseInt(timeParts[0], 10);
                        const minute = parseInt(timeParts[1], 10);

                        const eventDate = new Date(year, month, day, hour, minute);
                        const matchingPillInfo = pillsInfo.find((info) => info.id.toString() === item.id.toString());

                        return {
                            title: matchingPillInfo ? matchingPillInfo.name : 'Unknown',
                            start: eventDate,
                            end: eventDate,
                            color: 'green'
                        };
                    }

                    return null;
                })
                .filter((event) => event !== null);

            for (let i = 0; i < selectedPill.time_list.length; i++) {
                const time = selectedPill.time_list[i][0];
                const eventDateLast = moment(dateLast).set({
                    hour: parseInt(time.split(":")[0]),
                    minute: parseInt(time.split(":")[1]),
                }).toDate();

                const eventDateNext = moment(dateNext).set({
                    hour: parseInt(time.split(":")[0]),
                    minute: parseInt(time.split(":")[1]),
                }).toDate();

                events.push({
                    title: selectedPill.name || 'Unknown',
                    start: eventDateLast,
                    end: eventDateLast,
                    color: 'lightgray', // Set color for previous events
                });

                // Dodaj wydarzenie tylko dla dateNext, jeśli dateLast i dateNext są takie same
                if (!dateLast.isSame(dateNext, 'day')) {
                    events.push({
                        title: selectedPill.name || 'Unknown',
                        start: eventDateNext,
                        end: eventDateNext,
                        color: 'lightgray', // Set color for previous events
                    });
                }

                if (dateNext) {
                    console.log("halo");

                    for (let j = 1; j < 360; j++) {
                        const currentAdd = moment(dateNext).add(daysDifference * j, 'days').format('YYYY-MM-DD');
                        const currentSubtract = moment(dateNext).subtract(daysDifference * j, 'days').format('YYYY-MM-DD');

                        const aaaAdd = moment(currentAdd)
                            .set({
                                hour: parseInt(time.split(":")[0]),
                                minute: parseInt(time.split(":")[1]),
                            })
                            .toDate();

                        const aaaSubtract = moment(currentSubtract)
                            .set({
                                hour: parseInt(time.split(":")[0]),
                                minute: parseInt(time.split(":")[1]),
                            })
                            .toDate();

                        console.log("days fid" + daysDifference);
                        console.log("tutaj add " + j + " " + currentAdd);
                        console.log("tutaj subtract " + j + " " + currentSubtract);

                        events.push({
                            title: selectedPill.name || 'Unknown',
                            start: aaaAdd,
                            end: aaaAdd,
                            color: 'lightgray', // Set color for previous events
                        });

                        events.push({
                            title: selectedPill.name || 'Unknown',
                            start: aaaSubtract,
                            end: aaaSubtract,
                            color: 'lightgray', // Set color for previous events
                        });
                    }
                }
            }

            return events;
        }

        return [];
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
        console.log("dayfs differnece" + daysDifference);

        return daysDifference;
    };

    // Użycie funkcji
    useEffect(() => {
        const frequency = calculateFrequency();
        setFrequency(frequency);
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

    // Funkcja dostosowująca styl wydarzenia
    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color === 'lightgray' ? 'lightgray' : 'green';

        const style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block',
        };

        return {
            style: style,
        };
    };

    return (
        <div>
            <Navbar uid={uid}/>
            <div style={{height: 550, marginTop: 20, marginRight: 10, marginLeft: 10}}>
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
                    eventPropGetter={eventStyleGetter}
                />
                <Legend />
            </div>
        </div>
    );
};

export default MyCalendar;
