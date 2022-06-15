
const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/api_trips');

//Trips
router
    .route('/trips')
    .get(ctrlTrips.tripsList)
    .post(ctrlTrips.tripsAddTrip);

router
    .route('/trips/:code')
    .get(ctrlTrips.tripsFindByCode)
    .put(ctrlTrips.tripsUpdateTrip);


module.exports = router;