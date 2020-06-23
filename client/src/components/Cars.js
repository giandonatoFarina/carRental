import React, {useEffect, useState} from 'react';
import API from '../api/API';
import {Container, Table, Form, Col, FormLabel, Alert} from 'react-bootstrap';
import { Multiselect } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

function Cars(props){
    // list of categories and brands selected in filters
    const [selBrands, setSelBrands] = useState([]);
    const [selCategories, setSelCategories] = useState([]);
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(undefined);

    const carsToShow = () => {
        API.getCars()
            .then( (cars) => {
                let newCars = cars;
                if(selCategories.length)
                    newCars = newCars.filter( (c) => selCategories.includes(c.category) );
                if(selBrands.length)
                    newCars = newCars.filter( (c) => selBrands.includes(c.brand) );
                setCars(newCars);
                setError(undefined);
            })
            .catch( (err) => {
                props.value.handleErrors(err);
                setError(err.errObj.errors[0])
            });
    };

    useEffect(() => carsToShow(), [selBrands, selCategories]);

    if(error)
        return <Alert variant= "danger">{error.msg}</Alert>;

    return <Container fluid>
            <Filters {...props}
                     setSelBrands={setSelBrands}
                     setSelCategories={setSelCategories}/>
            <CarsTable cars={cars}/>
        </Container>;
}

function Filters(props) {
    return <Form style={{marginTop: 10}}>
        <Form.Row>
            <Col>
                <FormLabel>Select Categories</FormLabel>
                <Multiselect data={props.categories}
                             onChange={ (value) => props.setSelCategories(value) }/>
            </Col>
            <Col>
                <FormLabel>Select Brands</FormLabel>
                <Multiselect data={props.brands}
                             onChange={ (value) => props.setSelBrands(value) }/>
            </Col>
        </Form.Row>
    </Form>
}

function CarsTable(props) {

    return <Table striped bordered hover style={{marginTop: 10}}>
        <thead>
            <tr>
                <th>#</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
            </tr>
        </thead>
        <tbody>
            { props.cars.map( (car) => { return <CarRow key={car.id} car={car}/>; }) }
        </tbody>
    </Table>;
}

function CarRow(props) {
    return <tr>
        <td>{props.car.id}</td>
        <td>{props.car.category}</td>
        <td>{props.car.brand}</td>
        <td>{props.car.model}</td>
    </tr>;
}

export default Cars;