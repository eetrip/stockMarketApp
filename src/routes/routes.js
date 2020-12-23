// const routeHandler = require('./../handlers/route-handler');
// import user from "../../controllers/routes-handler";
import {
    signUp as signUpRoute,
    login as loginRoute
} from "../controllers/user";

export default class Routes{

    constructor(app){
		this.app = app;
	}

    /* creating app Routes starts */
    appRoutes() {
        // this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler);

		this.app.post( '/register', signUpRoute );

		this.app.post('/login', loginRoute );

		// this.app.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler);

		// this.app.post('/getMessages', routeHandler.getMessagesRouteHandler);

		// this.app.get('*', routeHandler.routeNotFoundHandler);		
    };

    routesConfig() {
        this.appRoutes();
	};
};