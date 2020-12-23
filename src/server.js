"use strict";
// Imported required packages
import express from 'express';
import http from 'http';
import Routes from "./routes/routes";
import appConfig from "./config/app-config";
const path = require('path'),
    socketio = require('socket.io'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
mongoose = require('mongoose');

class Server {

    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        // this.socket = socketio(this.http);
    };

    appConfig() {
        new appConfig(this.app).includeConfig();
    };

    includeRoutes() {
        new Routes(this.app).routesConfig();
        // new socketEvents(this.socket).socketConfig();
    };

    appExecute() {
        this.appConfig();
        this.includeRoutes();

        const port = process.env.PORT || 4000;
        const host = process.env.HOST || `localhost`;

        this.http.listen( port, host, () => {
            console.log(`
            Listening on ${host}:${port}
            `);
        });
    };
};

const app = new Server();
app.appExecute();

// MongoDB Databse url
// var mongoDatabase = 'mongodb://localhost:27017/employeeDetails';

// Created express server
// const app = express();
// mongoose.Promise = global.Promise;

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);

// // Connect Mongodb Database
// mongoose.connect(mongoDatabase, { useNewUrlParser: true }).then(
//     () => { console.log('Database is connected') },
//     err => { console.log('There is problem while connecting database ' + err) }
// );

// All the express routes
// import employeeRoutes from '../Routes/Employee.route';

// // Conver incoming data to JSON format
// app.use(bodyParser.json());

// // Enabled CORS
// app.use(cors());

// // Setup for the server port number
// const port = process.env.PORT || 4000;

// // Routes Configuration
// app.use('/employees', employeeRoutes);

// // Staring our express server
// const server = app.listen(port, function () {
//     console.log('Server Lisening On Port : ' + port);
// });