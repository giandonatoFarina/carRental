import React from 'react';
import {Navbar, Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";

function MyNavbar(props) {

    const value = props.value;

    return <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={NavLink} to="/">Car Rental</Navbar.Brand>
        { (value.authUser) ?
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/newrental">New Rental</Nav.Link>
                <Nav.Link href="#features">Past Rentals</Nav.Link>
                <Nav.Link href="#pricing">Future Rentals</Nav.Link>
            </Nav>
            : undefined
        }
        <Navbar.Collapse className="justify-content-end">
        {
            (value.authUser) ?
                <>
                    <Navbar.Text>Welcome back, {value.authUser.name}! </Navbar.Text>
                    <Nav.Link as={NavLink} to={"/"} onClick={() => value.logoutUser() }>Log Out</Nav.Link>
                </> :
                <Nav className="float-right">
                    <Nav.Link as={NavLink} to="/login">Log In</Nav.Link>
                </Nav>
        }
        </Navbar.Collapse>
    </Navbar>;
}

export default MyNavbar;