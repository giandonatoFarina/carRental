import React, {useContext, useEffect, useState} from 'react';
import {Container, Form, Col} from "react-bootstrap";
import {Redirect} from "react-router";


function NewRental(props){
    const [startingDay, setStartingDay] = useState("");
    const [endDay, setEndDay] = useState("");

    const value = props.value;
    const handleSubmit = (event) => {};
    // parameters: starting day, end day, car category, driver's age, #extra drivers, km/day, extra insurance
    return <Container fluid>
        {value.authErr && <Redirect to = "/login"/>}

        <Form method="POST" onSubmit={ (event) => handleSubmit(event)}>
            <Form.Row controlId="deadline-date">
                <Col>
                    <Form.Label>Starting Day</Form.Label>
                    <Form.Control type="date" name="startingDay" value = {startingDay} onChange={(ev) => setStartingDay(ev.target.value)}/>
                </Col>
                <Col>
                    <Form.Label>End Day</Form.Label>
                    <Form.Control type="date" name="endDay" value = {endDay} onChange={(ev) => setEndDay(ev.target.value)}/>
                </Col>
            </Form.Row>
        </Form>
    </Container>


}

export default NewRental;