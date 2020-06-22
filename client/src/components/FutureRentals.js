import React, {useEffect, useState} from 'react';
import API from '../api/API';
import {Container, Table, Button} from 'react-bootstrap';
import {Redirect} from "react-router";
import moment from 'moment';

function FutureRentalsTable(props){
    const [rentals, setRentals] = useState([]);
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        API.getFutureRentals()
            .then( (rentals) => {
                setRentals(rentals);
                setUpdate(false);
            })
            .catch( () => {} );
    }, [update]);

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
            { rentals.map( (rental,i) => { return <RentalRow key={i} rental={rental} update={setUpdate}/>; }) }
            </tbody>
        </Table>
    </Container>;
}

function RentalRow(props) {

    const deleteRental = () => {

        API.deleteRental(props.rental.cid, props.rental.startingDay)
            .then( () => props.update(true) )
            .catch( () => {} );
    }

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
        <td>
            <Button variant="secondary" onClick={ () => deleteRental()}>
                Delete
            </Button>
        </td>
    </tr>;
}

export default FutureRentalsTable;