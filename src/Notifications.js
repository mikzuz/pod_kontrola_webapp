import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equalTo, onValue, orderByChild, query, ref, update } from "firebase/database";
import { database } from "./components/firebase-config";
import { Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Navbar from "./components/Navbar";

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px",

};

const cardStyle = (isUnseen) => ({
    marginBottom: "10px",
    width: "auto",
    backgroundColor: isUnseen ? "#8ed1fc" : "white",
    cursor: 'pointer',
});

const Notifications = () => {
    const [notificationsData, setNotificationsData] = useState([]);
    const { uid } = useParams();
    const navigate = useNavigate();
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

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
            const notificationRef = ref(database, `Notifications/${notification.id}`);
            const updates = {
                seen: true,
            };
            update(notificationRef, updates);
        }

        setSelectedNotification(notification);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirm = () => {
        setDialogOpen(false);
        if (selectedNotification) {
            const { uid, patientId } = selectedNotification;
            navigate(`/monthlyReport/${uid}/${patientId}`);
        }
    };


    return (
        <div>
            <Navbar uid={uid} />
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

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Czy chcesz przejść do miesięcznego raportu pacjenta?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kliknięcie "Tak" przekieruje cię do miesięcznego raportu pacjenta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleDialogConfirm} color="primary">
                        Tak
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Notifications;
