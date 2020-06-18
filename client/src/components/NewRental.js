import React, {useContext, useEffect, useState} from 'react';
import {Container, Form, Col, Button} from "react-bootstrap";
import {Redirect} from "react-router";
import API from "../api/API";


// function NewRental(props){
//     // form parameters
//     const [startingDay, setStartingDay] = useState("");
//     const [endDay, setEndDay] = useState("");
//     const [category, setCategory] = useState("");
//     const [age, setAge] = useState("");
//     const [distance, setDistance] = useState("");
//     const [extraDrivers, setExtraDrivers] = useState(false);
//     const [extraInsurance, setExtraInsurance] = useState(false);
//     // returned values
//     const [cars, setCars] = useState(undefined);
//     const [price, setPrice] = useState(undefined);
//
//
//     const value = props.value;
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         console.log(startingDay + " " + endDay + " " + category + " " + age + " " + distance + " " + extraDrivers + " " + extraInsurance);
//        // apertura modal con form di pagamento
//     };
//     // parameters: starting day, end day, car category, driver's age, #extra drivers, km/day, extra insurance
//     return <Container fluid>
//         {value.authErr && <Redirect to = "/login"/>}
//
//         <Form method="POST" onSubmit={ (event) => handleSubmit(event)}>
//             <Form.Row style={{marginTop: 10}}>
//                 <Col>
//                     <Form.Label>Starting Day</Form.Label>
//                     <Form.Control type="date" name="startingDay" value = {startingDay} onChange={(ev) => setStartingDay(ev.target.value)}/>
//                 </Col>
//                 <Col>
//                     <Form.Label>End Day</Form.Label>
//                     <Form.Control type="date" name="endDay" value = {endDay} onChange={(ev) => setEndDay(ev.target.value)}/>
//                 </Col>
//             </Form.Row>
//             <Form.Row style={{marginTop: 10}}>
//                 <Col>
//                     <Form.Label>Category</Form.Label>
//                     <Form.Control as="select" name="category" value = {category} onChange={(ev) => setCategory(ev.target.value)}>
//                         {props.categories.map( (c) => <option>{c}</option>)};
//                     </Form.Control>
//                 </Col>
//                 <Col>
//                     <Form.Label>Driver's Age</Form.Label>
//                     <Form.Control as="select" name="age" value = {age} onChange={(ev) => setAge(ev.target.value)}>
//                         <option>{"18-24"}</option>
//                         <option>{"25-65"}</option>
//                         <option>{"66+"}</option>
//                     </Form.Control>
//                 </Col>
//                 <Col>
//                     <Form.Label>Estimated km/day</Form.Label>
//                     <Form.Control as="select" name="km" value = {distance}
//                                   onChange={(ev) => setDistance(ev.target.value)}>
//                         <option>{"50"}</option>
//                         <option>{"150"}</option>
//                         <option>{"unlimited"}</option>
//                     </Form.Control>
//                 </Col>
//             </Form.Row>
//             <Form.Row style={{marginTop: 10}}>
//                 <Col>
//                     <Form.Check type="checkbox" name="extra-drivers" label="More than one driver"
//                                 value={extraDrivers}
//                                 onChange={(ev) => setExtraDrivers(ev.target.value)}/>
//                 </Col>
//                 <Col>
//                     <Form.Check type="checkbox" name="extra-insurance" label="Extra insurance"
//                                 value={extraInsurance}
//                                 onChange={(ev) => setExtraInsurance(ev.target.value)}/>
//                 </Col>
//             </Form.Row>
//             <Form.Row style={{marginTop: 10}}>
//                 <Col>
//                     <h5>Available cars: </h5>
//                 </Col>
//                 <Col>
//                     <h5>Price: </h5>
//                 </Col>
//                 <Col>
//                     <Button className="float-right" type="submit">Rent</Button>
//                 </Col>
//             </Form.Row>
//         </Form>
//     </Container>
// }

class RentalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startingDay: "",
            endDay: "",
            category: "",
            age: undefined,
            distance: "",
            extraDrivers: 0,
            extraInsurance: false,
            cars: undefined,
            price: undefined,
            carId: undefined
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // Apertura modal per pagamento
    }

    updateField = (name, value) => {
        this.setState({[name]: value}, async () => {
            // fare query solo se tutti i parametri obbligatori inseriti
            if(this.state.startingDay && this.state.endDay &&
                this.state.category && this.state.age && this.state.distance)
                    API.getAvailableCars(this.state).then(
                        (res) => this.setState({cars: res.cars, price: res.price, carId: res.carId})
                    )
        });
    }

    render() {
        return <Container fluid>
            {this.props.value.authErr && <Redirect to = "/login"/>}

            <Form method="POST" onSubmit={ (event) => this.handleSubmit(event)}>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <Form.Label>Starting Day</Form.Label>
                        <Form.Control type="date" name="startingDay" value={this.state.startingDay}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Label>End Day</Form.Label>
                        <Form.Control type="date" name="endDay" value={this.state.endDay}
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
                        <Form.Control type="number" name="extraDrivers"
                                      value={this.state.extraDrivers}
                                      onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <Form.Check type="checkbox" name="extraInsurance" label="Extra insurance"
                                    value={this.state.extraInsurance}
                                    onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </Col>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <Col>
                        <h5>Available cars: {this.state.cars ? this.state.cars : "-"}</h5>
                    </Col>
                    <Col>
                        <h5>Price: {this.state.price ? this.state.price : "-"} €/day</h5>
                    </Col>
                    <Col>
                        <Button className="float-right" type="submit">Rent</Button>
                    </Col>
                </Form.Row>
            </Form>
        </Container>
    }

}



export default RentalForm;