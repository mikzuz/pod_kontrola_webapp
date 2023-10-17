import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, styled, Button } from "@mui/material";
import CollapsibleExample from './NavbarNew'; // Zaimportuj komponent

const MainPage = () => {
    function generate(element) {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            })
        );
    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <>
            <CollapsibleExample /> {/* Użyj komponentu CollapsibleExample */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ margin: "20px 40px" }}>Lista pacjentów</h2>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginTop: "10px" }}>
                    Poniżej znajduje się lista Twoich pacjentów.
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" style={{ marginBottom: "20px" }}>
                    Pod Kontrolą pozwala Ci na bieżąco monitorować ich stan zdrowia dzięki raportom oraz szybko reagować na niepokojące zmiany poprzez edycję listy leków.
                </Typography>

                <div style={{ display: "flex", minWidth: "600px", gap: "30px", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Demo style={{ minWidth: "inherit" }}>
                        <List>
                            {generate(
                                <ListItem>
                                    <IconButton disabled>
                                        <AccountCircleIcon fontSize="large" />
                                    </IconButton>
                                    <ListItemText primary="Single-line item" />
                                    <IconButton edge="end" aria-label="delete" style={{ margin: "0 3px" }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="more">
                                        <MoreVertIcon />
                                    </IconButton>
                                </ListItem>
                            )}
                        </List>
                    </Demo>
                </div>
                <Button variant="outlined" style={{ margin: "10px" }}>Dodaj pacjenta</Button>
            </div>
        </>
    );
};

export default MainPage;
