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