import {AppBar, Toolbar, Typography} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {styled} from '@mui/material/styles';
// import {logOut} from "../Firebase";
// import {useContext} from "react";
// import AuthContext from "../AuthContext";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';




const Navbar = ({ uid }) => {
    let navigate = useNavigate();

    const handleLogOut = async () => {
        // await logOut();
        navigate("/")
    };

    const handleNotificationsClick = async () => {
        navigate(`/notifications/${uid}`);
    };

    const CustomAppBar = styled(AppBar)`background-color: #8ed1fc;`;
    const WhiteTypography = styled(Typography)`color: #fff;`;
    const LinkNotUnderlined = styled(Link)`text-decoration: none;`;

    if (true) { //zalogowany
        return (
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CustomAppBar position="static">
                        <Toolbar variant="dense" sx={{justifyContent: "space-evenly"}}>
                            <div>
                                <LinkNotUnderlined to={`/notifications/${uid}`} onClick={() => handleNotificationsClick(uid)}>
                                    <WhiteTypography variant="h6">
                                        Powiadomienia
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined to={`/mainPage/${uid}`}>
                                    <WhiteTypography variant="h6">
                                        Lista pacjentów
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined to={`/`} onClick={handleLogOut}>
                                    <WhiteTypography variant="h6">
                                        Wyloguj się
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                        </Toolbar>
                    </CustomAppBar>
                </div>
                <ToastContainer position="top-right"></ToastContainer>
            </div>
        );
    } else {
        return (
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CustomAppBar position="static">
                        <Toolbar variant="dense" sx={{justifyContent: "space-evenly"}}>
                            <div>
                                <LinkNotUnderlined to="login">
                                    <WhiteTypography variant="h6">
                                        Zaloguj się
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined>
                                    <WhiteTypography variant="h6">
                                        Pod Kontrolą
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined to="register">
                                    <WhiteTypography variant="h6">
                                        Zarejestruj się
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                        </Toolbar>
                    </CustomAppBar>
                </div>
                <ToastContainer position="top-right"></ToastContainer>
            </div>
        );
    }
}

export default Navbar;