const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = (req, res) => {

    //Validates required fields have been sent
    if (!req.body.name || !req.body.email || !req.body.password) {

        console.log(req.body.name);
        return res
            .status(400)
            .json({ "message": "All fields Required duh" });
    }

    //Creates Model instance of user
    const user = new User();

    //Sets name and email for new user instance
    user.name = req.body.name;
    user.email = req.body.email;

    //Use 'setPassword' method to create and add the salt and hash
    user.setPassword(req.body.password);

    //Save the user
    user.save((err) => {
        if (err) {
            res
                .status(400)
                .json(err);
        }

        //returns JSON Web Token when saved 
        else {
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        }
    })
};

const login = (req, res) => {

    //Validate required fields are supplied 
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json(err);
    }

    //passes name of strategy and a call back to Auth method
    passport.authenticate('local', (err, user, info) => {

        //returns error if passport returns error
        if (err) {
            return res
                .status(400)
                .json(err);
        }

        //IF passport returns a user instance; genertaes and sends JWT
        if (user) {
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        }

        //Returns message why Auth failed
        else {
            res
                .status(401)
                .json(info);
        }
    })
        //ensures 'req' and 'res' are available to passport
        (req, res);
};

module.exports = {
    register,
    login
};