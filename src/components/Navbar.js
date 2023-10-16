// import {AppBar, Toolbar, Typography} from "@mui/material";
// import {Link, useNavigate} from "react-router-dom";
// import {styled} from '@mui/material/styles';
// // import {logOut} from "../Firebase";
// import {useContext} from "react";
// // import AuthContext from "../auth/AuthContext";
// import {ToastContainer} from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
//
//
// const Navbar = () => {
//
//     let navigate = useNavigate();
//
//     const {user} = useContext(AuthContext);
//     const handleLogOut = async () => {
//         // await logOut();
//         navigate("/")
//     };
//
//     const CustomAppBar = styled(AppBar)`background-color: rgb(78, 23, 94);`;
//     const WhiteTypography = styled(Typography)`color: #fff;`;
//     const LinkNotUnderlined = styled(Link)`text-decoration: none;`;
//
//     console.log(user)
//     if (user) {
//         return (
//             <div>
//                 <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
//                     <CustomAppBar position="static">
//                         <Toolbar variant="dense" sx={{justifyContent: "space-evenly"}}>
//                             <div>
//                                 <LinkNotUnderlined to="/">
//                                     <WhiteTypography variant="h6">
//                                         Reading Tracker
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                             <div>
//                                 <LinkNotUnderlined to="profile">
//                                     <WhiteTypography variant="h6">
//                                         Your Profile
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                             <div>
//                                 <LinkNotUnderlined onClick={handleLogOut}>
//                                     <WhiteTypography variant="h6">
//                                         Sign out
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                         </Toolbar>
//                     </CustomAppBar>
//                 </div>
//                 <ToastContainer position="top-right"></ToastContainer>
//             </div>
//         );
//     } else {
//         return (
//             <div>
//                 <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
//                     <CustomAppBar position="static">
//                         <Toolbar variant="dense" sx={{justifyContent: "space-evenly"}}>
//                             <div>
//                                 <LinkNotUnderlined to="login">
//                                     <WhiteTypography variant="h6">
//                                         Sign in
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                             <div>
//                                 <LinkNotUnderlined to="/">
//                                     <WhiteTypography variant="h6">
//                                         Reading Tracker
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                             <div>
//                                 <LinkNotUnderlined to="register">
//                                     <WhiteTypography variant="h6">
//                                         Sign up
//                                     </WhiteTypography>
//                                 </LinkNotUnderlined>
//                             </div>
//                         </Toolbar>
//                     </CustomAppBar>
//                 </div>
//                 <ToastContainer position="top-right"></ToastContainer>
//             </div>
//         );
//     }
// }
//
// export default Navbar;