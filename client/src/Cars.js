import React, {useState} from 'react';
import API from './API';
import {Container, Table, Form, Col, FormLabel} from 'react-bootstrap';
import { Multiselect } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

function Cars(props){
    const [categories, setCategories] = useState( [] );
    const [brands, setBrands] = useState( [] );

    let cars = API.getCars();
    if(categories.length)
        cars = cars.filter( (c) => categories.includes(c.category) );
    if(brands.length)
        cars = cars.filter( (c) => brands.includes(c.brand) );

    return <Container fluid>
            <Filters setCategories={setCategories} setBrands={setBrands}/>
            <CarsTable cars={cars}/>
        </Container>;
}

function Filters(props) {
    const categories = API.getCategories();
    const brands = API.getBrands();

    return <Form style={{marginTop: 10}}
                 onSubmit={ (ev) => ev.preventDefault() }>
        <Form.Row>
            <Col>
                <FormLabel>Select Categories</FormLabel>
                <Multiselect data={categories}
                             onChange={ (value) => props.setCategories(value) }/>
            </Col>
            <Col>
                <FormLabel>Select Brands</FormLabel>
                <Multiselect data={brands}
                             onChange={ (value) => props.setBrands(value) }/>
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
            { props.cars.map( (car) => { return <CarRow car={car}/>; }) }
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