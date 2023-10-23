import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { database } from "./firebase-config";
import { Card, CardContent, Typography } from '@mui/material';

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const cardStyle = {
    marginBottom: "10px",
    width: "auto", // Ustawiamy szerokość na "auto"
};

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

    return (
        <div style={containerStyle}>
            {notificationsData.map((notification, index) => (
                <Card key={index} variant="outlined" style={cardStyle}>
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
