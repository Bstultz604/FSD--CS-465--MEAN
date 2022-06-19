
const mongoose = require('mongoose');           //.set('debug', true);
const Model = mongoose.model('trips');
const User = mongoose.model('users');

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
                console.log("tripsList was called succesfully");
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
                    .status(400)
                    .json(err);
            }

            else {
                return res
                    .status(200)
                    .json(trip);
            }
        });
};

const tripsAddTrip = async (req, res) => {

    getUser(req, res, (req, res) => {
        Model
            .create({
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
                (err, trip) => {
                    if (err) {
                        return res
                            .status(400) //Bad Request
                            .json(err);
                    }
                    else {
                        return res
                            .status(201) //created
                            .json(trip);
                    }
                });
    });
}

const tripsUpdateTrip = async (req, res) => {
    
    getUser(req, res, (req, res) => {
        Model
            .findOneAndUpdate({ 'code': req.params.tripCode }, {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description,
            }, { new: true }, false)
            .then(trip => {
                if (!trip) {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with code "
                                + req.params.code
                        });
                }
                res.send(trip);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with spcified code "
                                + req.params.code
                        });
                }
                return res
                    .status(500) // server error
                    .json(err);
            });
    })
}


const getUser = (req, res, callback) => {

    //Validates the JWT info on request object
    if (req.payload && req.payload.email) {
        User

            //uses email to find user
            .findOne({ email: req.payload.email })
            .exec((err, user) => {

                if (!user) {
                    return res
                        .json(404)
                        .json({ "message": "User not found" });
                }

                else if (err) {
                    console.log(err);
                    return res
                        .status(404)
                        .json(err);
                }

                //runs callback, passing users name
                callback(req, res, user.name);
            });
    }

    else {
        return res.status(404).json({ "message": "User not found" });
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    getUser
};