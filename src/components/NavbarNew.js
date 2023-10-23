import React from 'react';
import {Link, useParams} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function CollapsibleExample() {
    const navigate = useNavigate();

    const { uid } = useParams();

    console.log(uid)


    const blueText = {
        color: '#8ed1fc',
    };

    const handleMiesiecznyRaportClick = () => {
        navigate('/monthlyReport'); // Przekierowanie do "/monthlyReport"
    };

    const handleNotificationsClick = (uid) => {
        navigate(`/notifications/${uid}`);
    };


    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Link to="/monthlyReport" onClick={handleMiesiecznyRaportClick}>
                    <Navbar.Brand style={blueText}>Miesięczny raport</Navbar.Brand>
                </Link>
                <Link to="/notifications/:uid" onClick={() => handleNotificationsClick(uid)}>
                    <Navbar.Brand style={blueText}>Powiadomienia</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/features">
                            <Nav.Link style={blueText}>Features</Nav.Link>
                        </Link>
                        <Link to="/pricing">
                            <Nav.Link style={blueText}>Pricing</Nav.Link>
                        </Link>
                    </Nav>
                    <Nav>
                        <Nav.Link style={blueText} href="#deets">More deets</Nav.Link>
                        <Nav.Link style={blueText} eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CollapsibleExample;
