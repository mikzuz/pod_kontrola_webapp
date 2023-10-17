import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function CollapsibleExample() {
    const blueText = {
        color: '#8ed1fc', // Dostosuj kolor tekstu tutaj
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home" style={blueText}>React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features" style={blueText}>Features</Nav.Link>
                        <Nav.Link href="#pricing" style={blueText}>Pricing</Nav.Link>
                        {/*<NavDropdown title="Dropdown" id="collapsible-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1" style={blueText}>Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2" style={blueText}>*/}
                        {/*        Another action*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3" style={blueText}>Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4" style={blueText}>*/}
                        {/*        Separated link*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets" style={blueText}>More deets</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes" style={blueText}>
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CollapsibleExample;
