import React from 'react';
import {Navbar, Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";

function MyNavbar(props) {

    return <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Car Rental</Navbar.Brand>
        { (props. logged) ?
            <Nav className="mr-auto">
                <Nav.Link>New Rental</Nav.Link>
                <Nav.Link href="#features">Past Rentals</Nav.Link>
                <Nav.Link href="#pricing">Future Rentals</Nav.Link>
            </Nav>
            : undefined
        }
        <Navbar.Collapse className="justify-content-end">
        {
            (props.logged) ?
                <Navbar.Text>Welcome, User!</Navbar.Text> :
                <Nav className="float-right">
                    <Nav.Link as={NavLink} to="/login">Log In</Nav.Link>
                </Nav>
        }
        </Navbar.Collapse>
    </Navbar>;
}

export default MyNavbar;