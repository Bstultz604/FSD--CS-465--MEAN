
const mongoose = require('mongoose');           //.set('debug', true);
const Model = mongoose.model('trips');

// GET: /trips_schema - list all the trips
const tripsList = async (req, res) => {
    Model
        .find({}) //empty filter to GET all trips
        .exec((err, trips) => {
            if (trips.length == 0) {
                return res
                    .status(404)
                    .json({ "message": "trips not found" });
            }

            else if (err) {
                return res
                    .status(404)
                    .json(err);
            }

            else {
                console.log(trips);
                return res
                    .status(200)
                    .json(trips);
            }
        });
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindByCode = async (req, res) => {
    Model
        .find({ 'code': req.params.code })
        .exec((err, trip) => {
            if (trip.length == 0) {
                return res
                    .status(404)
                    .json({ "message": "trip not found" });
            }

            else if (err) {
                return res
                    .status(404)
                    .json(err);
            }

            else {
                return res
                    .status(200)
                    .json(trip);
            }
        });
};

module.exports = {
    tripsList,
    tripsFindByCode
};