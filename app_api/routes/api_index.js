
const express = require('express');
const router = express.Router();


const ctrlTrips = require('../controllers/api_trips');
const ctrlAuth = require('../controllers/authentication');


const jwt = require("express-jwt");

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"]
});

//Trips
router
    .route('/trips')
    .get(ctrlTrips.tripsList)
    .post(auth, ctrlTrips.tripsAddTrip);

router
    .route('/trips/:code')
    .get(ctrlTrips.tripsFindByCode)
    .put(auth ,ctrlTrips.tripsUpdateTrip);


router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;