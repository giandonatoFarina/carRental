const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userDao = require('./userDao');
const carDao = require('./carDao');

const PORT = 3001;
app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300; //seconds
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
        }
    );
});