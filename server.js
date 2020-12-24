/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const socketEvents = require('./web/socket'); 
const routes = require('./web/routes');
const cron = require('./utils/cron');
const appConfig = require('./config/app-config'); 


class Server{

    constructor(){
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig(){        
        new appConfig(this.app).includeConfig();
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }
    /* Including app Routes ends*/

    includeCron() {
        new cron();
    };

    appExecute(){
        this.appConfig();
        this.includeRoutes();
        this.includeCron();

        const port =  process.env.PORT || 4000;
        const host = process.env.HOST || `localhost`;      

        this.http.listen(port, host, () => {
            console.log(`Listening on http://${host}:${port}`);
        });
    }

}
    
const app = new Server();
app.appExecute();