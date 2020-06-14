import React, {useContext, useEffect, useState} from 'react';

import {Redirect} from "react-router-dom";
import {Container, Row, Col, Button, Alert, Form} from "react-bootstrap";

function LoginPage(props) {
    const context = props.value;

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        context.loginUser(user, pwd);
        setSubmitted(true);
    }

    if(submitted)
        return <Redirect to="/newrental"/>
    return <>
        <Container fluid>
            <Row>
                <Col>
                    <h2 className="ui teal image header">
                        <div className="content">Log In</div>
                    </h2>

                    <Form method="POST" onSubmit={(event) => handleSubmit(event)}>
                        <Form.Group controlId="username">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control type="email" name="email" placeholder="E-mail" value = {user} onChange={(ev) => setUser(ev.target.value)} required autoFocus/>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Password" value = {pwd} onChange={(ev) => setPwd(ev.target.value)} required/>
                        </Form.Group>

                        <Button variant="primary" type="submit">Login</Button>
                    </Form>
                    {context.authErr &&
                        <Alert variant= "danger">{context.authErr.errors[0].msg}</Alert>
                    }
                </Col>
            </Row>
        </Container>
    </>
}

export default LoginPage;