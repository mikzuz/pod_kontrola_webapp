import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { equalTo, onValue, orderByChild, query, ref, update } from "firebase/database";
import { database } from "./firebase-config";
import { Card, CardContent, Typography } from '@mui/material';

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const cardStyle = (isUnseen) => ({
    marginBottom: "10px",
    width: "auto",
    backgroundColor: isUnseen ? "#8ed1fc" : "white",
    cursor: 'pointer', // Dodajemy kursor "pointer", aby karta była klikalna
});

const Notifications = () => {
    const [notificationsData, setNotificationsData] = useState([]);
    const { uid } = useParams();

    useEffect(() => {
        if (uid) {
            const reportsRef = ref(database, 'Notifications');
            const userStatsQuery = query(reportsRef, orderByChild('recipient'), equalTo(uid));
            onValue(userStatsQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const report = snapshot.val();
                    const statsArray = Object.values(report);
                    setNotificationsData(statsArray);
                }
            });
        }
    }, [uid]);

    const handleCardClick = (notification) => {
        if (!notification.seen) {
            // Jeśli seen jest false, aktualizuj wartość seen na true w bazie danych
            const notificationRef = ref(database, `Notifications/${notification.id}`);
            const updates = {
                seen: true,
            };
            update(notificationRef, updates);
        }
    };

    return (
        <div style={containerStyle}>
            {notificationsData.map((notification, index) => (
                <Card key={index} variant="outlined" style={cardStyle(!notification.seen)} onClick={() => handleCardClick(notification)}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Data: {notification.date}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Wiadomość: {notification.message}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Notifications;
