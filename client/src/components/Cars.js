import React, {useEffect, useState} from 'react';
import API from '../api/API';
import {Container, Table, Form, Col, FormLabel} from 'react-bootstrap';
import { Multiselect } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

function Cars(props){
    // list of categories and brands selected in filters
    const [selBrands, setSelBrands] = useState([]);
    const [selCategories, setSelCategories] = useState([]);
    const [cars, setCars] = useState([]);

    const carsToShow = () => {
        API.getCars()
            .then( (cars) => {
                let newCars = cars;
                if(selCategories.length)
                    newCars = newCars.filter( (c) => selCategories.includes(c.category) );
                if(selBrands.length)
                    newCars = newCars.filter( (c) => selBrands.includes(c.brand) );
                setCars(newCars);
            })
            .catch( (errorObj) => props.handleErrors(errorObj) );
    };

    useEffect(() => carsToShow(), [selBrands, selCategories]);

    return <Container fluid>
            <Filters {...props}
                     setSelBrands={setSelBrands}
                     setSelCategories={setSelCategories}/>
            <CarsTable cars={cars}/>
        </Container>;
}

function Filters(props) {
    // list of all categories and brands
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect( () => {
        API.getCategories()
            .then( (categories) => setCategories(categories) )
            .catch( (errorObj) => props.handleErrors(errorObj) );
        API.getBrands()
            .then( (brands) => setBrands(brands) )
            .catch( (errorObj) => props.handleErrors(errorObj) );
    }, []);

    return <Form style={{marginTop: 10}}>
        <Form.Row>
            <Col>
                <FormLabel>Select Categories</FormLabel>
                <Multiselect data={categories}
                             onChange={ (value) => props.setSelCategories(value) }/>
            </Col>
            <Col>
                <FormLabel>Select Brands</FormLabel>
                <Multiselect data={brands}
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