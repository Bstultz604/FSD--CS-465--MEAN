

const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

//avoid 'current Server Discovery and Monitoring engine is deprecated'
mongoose.set('useUnifiedTopology', true);

const connect = () => {
    setTimeout(
        () => mongoose.connect(
            dbURI, {
            useNewUrlParser: true,
            useCreateIndex: true
        }), 1000);
}

//Logs when a successful mongoose connection is made
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

//Logs when an error occurs connecting to mongoose
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err); 
});

//Logs when connection to mongoose is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected'); 
});    

//Emits SIGINT signal
//Caputures signal and closes down
if (process.platform === 'win32') {

    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}

//Outputs to console when a databse is closed and gives reason for close
const gracefulShutdown = (msg, callback) => {                   //Defines function to accepts a message and a callback function
    mongoose.connection.close(() => {                           //Closes the mongoose connection; passing a anonymous function to run when closed
        console.log(`Mongoose disconnected through ${msg}`);    /* Outputs message and calls calback function when connection closes*/
        callback();                                             /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    });
};

//for nodemon restart
process.once('SIGUSR2', () => {                                 // Listens for SIGUSER2; used by nodemon
    gracefulShutdown('nodemon restart', () => {                 /* sends message to gracefulShutdown and callback to kill process; emiting SIGUSR2 again*/
        process.kill(process.pid, 'SIGUSR2');                   /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    });
});

//for app termination
process.on('SIGINT', () => {                                    // Listens for SIGINT to be emitted upon app termination
    gracefulShutdown('app termination', () => {                 /* Sends message to gracefulShutdown and callback to exit Node process*/
        process.exit(0);                                        /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    });
});

//For Heroku app termination
process.on('SIGTERM', () => {                                   //Listens for SIGTERM to be emitted when Heroku shuts down the process
    gracefulShutdown('Heroku app shutdown', () => {             /* Sends message to gracefulShutdown and callback to exit Node process*/
        process.exit(0);                                        /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    });
});

connect();

//bring in the mongoose schema
require('./models/trip_schema');
require('./models/user_schema');