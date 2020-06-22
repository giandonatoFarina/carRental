import React, {useEffect, useState} from 'react';
import API from '../api/API';
import {Container, Table} from 'react-bootstrap';
import {Redirect} from "react-router";
import moment from 'moment';

function PastRentalsTable(props){
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        API.getPastRentals()
            .then( (rentals) => setRentals(rentals))
            .catch( () => {} );
    }, []);

    return <Container fluid>
        {props.value.authErr && <Redirect to = "/login"/>}

        <Table striped bordered hover style={{marginTop: 10}}>
            <thead>
            <tr>
                <th>Starting Day</th>
                <th>End Day</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Driver's Age</th>
                <th>Estimated km/day</th>
                <th>Extra Drivers</th>
                <th>Extra Insurance</th>
            </tr>
            </thead>
            <tbody>
            { rentals.map( (rental,i) => { return <RentalRow key={i} rental={rental}/>; }) }
            </tbody>
        </Table>
    </Container>;
}

function RentalRow(props) {
    return <tr>
        <td>{moment(props.rental.startingDay).format("DD-MM-YYYY")}</td>
        <td>{moment(props.rental.endDay).format("DD-MM-YYYY")}</td>
        <td>{props.rental.category}</td>
        <td>{props.rental.brand}</td>
        <td>{props.rental.model}</td>
        <td>{props.rental.age}</td>
        <td>{props.rental.distance}</td>
        <td>{props.rental.extraDrivers}</td>
        <td>{props.rental.extraInsurance ? "yes" : "no"}</td>
    </tr>;
}

export default PastRentalsTable;