import expressConfig from "./express-config";
import bodyParser from "body-parser";
import cors from "cors";
const dotenv = require('dotenv');

export default class AppConfig{

    constructor( app ) {
        dotenv.config();
        this.app = app;
    };

    includeConfig() {
        this.app.use(
            bodyParser.json()
        );
        this.app.use(
            cors()
        );
        new expressConfig( this.app );
    };
};