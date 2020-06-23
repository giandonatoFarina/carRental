import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {Container, Row, Col, Button, Alert, Form} from "react-bootstrap";

function LoginPage(props) {
    const value = props.value;

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        value.loginUser(user, pwd);
    }

    if(value.logged)
        return <Redirect to="/newrental"/>
    return <>
        <Container fluid id="login">
            <div id="loginForm">
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

                            <Button variant="dark" type="submit">Login</Button>
                        </Form>

                    </Col>
                </Row>
            </div>
            {value.authErr &&
                <Alert id="alert" variant= "danger">{value.authErr.msg}</Alert>
            }
        </Container>
    </>
}

export default LoginPage;