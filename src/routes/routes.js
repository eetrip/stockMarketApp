'use strict';

const baseController = require('../controller/baseController');
import {
    verifyBearerToken,
    decodeBearerToken
} from "../middleware/authentication";

class Routes{

	constructor(app){
		this.app = app;
	}

	// cmnt
	/* creating app Routes starts */
	appRoutes(){

		//user routes
		this.app.post('/usernameAvailable', baseController.userNameCheckHandler);
		this.app.post( '/register', baseController.registerRouteHandler );
		this.app.post( '/login', baseController.loginRouteHandler);
		this.app.post('/userSessionCheck', decodeBearerToken, baseController.userSessionCheckRouteHandler);

		//company data routes
		this.app.post( '/registerCompany', baseController.createCompany );
		this.app.get( '/listCompanies', decodeBearerToken, baseController.listCompanies );
		this.app.post( '/buyCompany', decodeBearerToken, baseController.buyCompany );

		//miscellaneous routes
		this.app.post('/getMessages', decodeBearerToken, baseController.getMessagesRouteHandler);
		this.app.get('*', baseController.routeNotFoundHandler);
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;
