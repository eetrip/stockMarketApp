'use strict';

const routeHandler = require('./../handlers/route-handler');
import {
    verifyBearerToken,
    decodeBearerToken
} from "../middleware/authentication";

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){

		//user routes
		this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler);
		this.app.post( '/register', routeHandler.registerRouteHandler );
		this.app.post( '/login', routeHandler.loginRouteHandler);
		this.app.post('/userSessionCheck', decodeBearerToken, routeHandler.userSessionCheckRouteHandler);

		//company data routes
		this.app.post( '/registerCompany', routeHandler.createCompany );
		this.app.get( '/listCompanies', decodeBearerToken, routeHandler.listCompanies );
		this.app.post( '/buyCompany', decodeBearerToken, routeHandler.buyCompany );

		//miscellaneous routes
		this.app.post('/getMessages', decodeBearerToken, routeHandler.getMessagesRouteHandler);
		this.app.get('*', routeHandler.routeNotFoundHandler);
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;
