import {AppBar, Toolbar, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {styled} from '@mui/material/styles';
import {signOut} from "firebase/auth";
import {auth} from './firebase-config';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

    let navigate = useNavigate();

    const handleLogOut = async () => {
        await logOut();
        navigate("/")
    };

    const logOut = async () => {
        try {
            await signOut(auth)
            toast.info("Poprawnie wylogowano!")
            return true
        } catch (error) {
            return false
        }
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
                                <LinkNotUnderlined to="/">
                                    <WhiteTypography variant="h6">
                                        Powiadomienia
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined to="mainPage">
                                    <WhiteTypography variant="h6">
                                        Lista pacjentów
                                    </WhiteTypography>
                                </LinkNotUnderlined>
                            </div>
                            <div>
                                <LinkNotUnderlined onClick={handleLogOut}>
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
                                <LinkNotUnderlined to="/">
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