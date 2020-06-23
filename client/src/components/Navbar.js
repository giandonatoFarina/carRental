import React from 'react';
import {Navbar, Nav, Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";

function MyNavbar(props) {

    const value = props.value;

    const clickHandler = () => {
        if(value.authUser)
            value.logoutUser();
    }

    return <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={NavLink} to="/">Car Rental</Navbar.Brand>
        { (value.authUser) ?
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/newrental">New Rental</Nav.Link>
                <Nav.Link as={NavLink} to="/pastrentals">Past Rentals</Nav.Link>
                <Nav.Link as={NavLink} to="/futurerentals">Future Rentals</Nav.Link>
            </Nav>
            : undefined
        }
        <Navbar.Collapse className="justify-content-end">

            {value.authUser && <Navbar.Text>Welcome back, {value.authUser.name}! </Navbar.Text>}

            <Button variant="secondary" as={NavLink}
                    to={value.authUser ? "/" : "/login"}
                    onClick={() => clickHandler()}>
                {value.authUser ? "Log Out" : "Log In"}
            </Button>
        </Navbar.Collapse>
    </Navbar>;
}

export default MyNavbar;