const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userDao = require('./userDao');
const carDao = require('./carDao');
const moment = require('moment');
const {check, validationResult} = require('express-validator');

const PORT = 3001;
app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 30*60; //300; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    userDao.getUser(username)
        .then((user) => {
            if(user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }]
                });
            } else {
                if(!userDao.checkPassword(user, password)){
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                    res.json({id: user.id, name: user.name});
                }
            }
        }).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        });
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// Public APIs

app.get('/api/cars', (req, res) => {
   carDao.getCars()
       .then((cars) => res.json(cars))
       .catch((err) => res.status(500).json({errors: [{'msg': err}] }));
});

app.get('/api/categories', (req, res) => {
    carDao.getCategories()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(500).json({errors: [{'msg': err}] }));
});

app.get('/api/brands', (req, res) => {
    carDao.getBrands()
        .then((brands) => res.json(brands))
        .catch((err) => res.status(500).json({errors: [{'msg': err}] }));
});


// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name});
        }).catch(
        (err) => {
            res.status(401).json(authErrorObj);
        });
});

// GET /configurator?parameters
app.get('/api/configurator', [
    check('extraInsurance').isBoolean(),
    check('age').isInt({min: 18}),
    check('extraDrivers').isInt({min: 0}),
    check('startingDay').isISO8601(),
    check('endDay').isISO8601(),
    check('category').isString(),
    check('distance').isString()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty() || moment(req.query.endDay).isBefore(req.query.startingDay))
        return res.status(422).json({errors: errors.array()});
    const userId =  req.user && req.user.user;
    carDao.getAvailableCars(req.query)
        .then( async (rows) => {
            const price = await priceComputation(req.query, userId, rows.length);
            res.json({
                cars: rows.length,
                carId: rows[0],
                price: price
            });
        })
        .catch((err) => res.status(500).json(err));
});

// POST /newrental
app.post('/api/newrental', [
    // check rental data
    check('extraInsurance').isBoolean(),
    check('age').isInt({min: 18}),
    check('extraDrivers').isInt({min: 0}),
    check('startingDay').isISO8601(),
    check('endDay').isISO8601(),
    check('category').isString(),
    check('distance').isString(),
    check('carId').isInt(),
    // check payment data
    check('fullName').isString(),
    check('cardNumber').isNumeric(),
    check('cvv').isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || moment(req.body.endDay).isBefore(req.body.startingDay))
        return res.status(422).json({errors: errors.array()});
    const userId = req.user && req.user.user;
    carDao.insertRental({
        uid: userId,
        cid: req.body.carId,
        startingDay: req.body.startingDay,
        endDay: req.body.endDay,
        extraDrivers: req.body.extraDrivers,
        extraInsurance: req.body.extraInsurance,
        age: req.body.age,
        distance: req.body.distance
    })
        .then( () => res.status(201).end() )
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
});


async function priceComputation(params, userId, remainingCars) {
    const rate = { "A": 80, "B": 70, "C": 60, "D": 50, "E": 40 };
    let m = 1;

    const finishedRentals = await carDao.getFinishedRentals(userId);
    if(finishedRentals >= 3) m -= 0.1;

    const carsByCategory = await carDao.getCarsByCategory(params.category);
    if(remainingCars/carsByCategory < 0.1) m += 0.1;

    if(params.extraDrivers > 0) m += 0.15;

    if(params.extraInsurance === "true") m += 0.2;

    if(params.distance === "50") m -= 0.05;        // less than 50 km/day
    else if(params.distance === "unlimited") m += 0.05;   // unlimited km/day

    if(params.age < 25) m += 0.05;              // age 18-25
    else if(params.age > 65) m += 0.1;          // age 65+

    // numero giorni
    const days = moment(params.endDay).diff(moment(params.startingDay), 'days');
    return rate[params.category] * days * m;
}
