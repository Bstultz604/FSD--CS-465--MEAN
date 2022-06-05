
const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/api_trips');

//Trips
router
    .route('/trips')
    .get(ctrlTrips.tripsList);

router
    .route('/trips/:code')
    .get(ctrlTrips.tripsFindByCode);

module.exports = router;