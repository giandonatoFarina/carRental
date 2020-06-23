import React, {useState} from 'react';
import {Container, Form, Col, Button, Modal} from "react-bootstrap";
import {Redirect} from "react-router";
import API from "../api/API";
import moment from "moment";

class RentalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startingDay: "",
            endDay: "",
            category: "A",
            age: undefined,
            distance: "50",
            extraDrivers: 0,
            extraInsurance: false,
            cars: undefined,
            price: undefined,
            carId: undefined,
            showModal: false,
            error: undefined
        };
    }

    handleShow = () => {
        const show = !this.state.showModal;
        this.setState({showModal: show});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.handleShow();
    }

    updateField = (name, value) => {
        this.setState({[name]: value}, async () => {
            // call API only if mandatory params are insert
            if(this.state.startingDay && this.state.endDay &&
                this.state.category && this.state.age && this.state.distance &&
                moment(this.state.endDay).isAfter(this.state.startingDay))
                    API.getAvailableCars(this.state)
                        .then((res) => this.setState({cars: res.cars, price: res.price, carId: res.carId.id}))
                        .catch((err) => this.setState({cars: undefined, price: undefined, carId: undefined}));
            else this.setState({cars: undefined, price: undefined, carId: undefined});
        });
    }

    render() {
        return <Container fluid id="newRental">
            {this.props.value.authErr && <Redirect to = "/login"/>}

            <Form method="POST" onSubmit={ (event) => this.handleSubmit(event)}>
                <Form.Row>
                    <Col>
                        <Form.Label>Starting Day</Form.Label>
                        <Form.Control type="date" name="startingDay" required
                                      min={moment().format("YYYY-MM-DD")}
                                      value={this.state.startingDay}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Label>End Day</Form.Label>
                        <Form.Control type="date" name="endDay" required
                                      min={moment().add(1, 'd').format("YYYY-MM-DD")}
                                      value={this.state.endDay}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" name="category" value={this.state.category}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                            {this.props.categories.map( (c, i) => <option key={i}>{c}</option>)};
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Driver's Age</Form.Label>
                        <Form.Control type="number" min="18" name="age" required value={this.state.age}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Label>Estimated km/day</Form.Label>
                        <Form.Control as="select" name="distance" value={this.state.distance}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                            <option>{"50"}</option>
                            <option>{"150"}</option>
                            <option>{"unlimited"}</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Extra Drivers</Form.Label>
                        <Form.Control type="number" name="extraDrivers" min="0" required
                                      value={this.state.extraDrivers}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <Form.Check type="checkbox" name="extraInsurance" label="Extra insurance"
                                    checked={this.state.extraInsurance}
                                    onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}/>
                    </Col>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <h5>Available cars: {this.state.cars ? this.state.cars : "-"}</h5>
                    </Col>
                    <Col>
                        <h5>Price: {this.state.price ? this.state.price : "-"} €</h5>
                    </Col>
                    <Col>
                        <Button variant="dark" className="float-right" type="submit">Rent</Button>
                    </Col>
                </Form.Row>
            </Form>

            <MyModal show={this.state.showModal}
                     handleShow={this.handleShow}
                     rentalData={this.state}/>
        </Container>
    }

}

function MyModal(props) {
    return <Modal
        show={props.show} onHide={props.handleShow} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Payment
            </Modal.Title>
        </Modal.Header>
        <PaymentForm {...props}/>
    </Modal>
}

function PaymentForm(props) {
    const [submitted,setSubmitted] = useState(false);

    const [fullName, setFullName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");

    const handleSubmit = (ev) => {
        ev.preventDefault();
        API.payment({
            fullName: fullName,
            cardNumber: cardNumber,
            cvv: cvv,
        }).then( () => {
            API.insertRental(props.rentalData)
                .then( () => setSubmitted(true) )
                .catch( () => {} );
        })
            .catch( () => {} );
    };

    if(submitted)
        return <Redirect to="/futuresrentals"/>;

    return <Form method="POST" onSubmit={ (event) => handleSubmit(event)}>
        <Modal.Body>
            <Form.Row>
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" name="cardNumber" value={cardNumber}
                              onChange={(ev) => setCardNumber(ev.target.value)}/>
            </Form.Row>
            <Form.Row style={{marginTop: 10}}>
                <Col>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="fullName" value={fullName}
                                  onChange={(ev) => setFullName(ev.target.value)}/>
                </Col>
                <Col>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" name="cvv" value={cvv}
                                  onChange={(ev) => setCvv(ev.target.value)}/>
                </Col>
            </Form.Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" className="float-right"
                    onClick={props.handleShow}>Cancel</Button>
            <Button className="float-right" type="submit">Pay</Button>
        </Modal.Footer>
    </Form>
}

export default RentalForm;