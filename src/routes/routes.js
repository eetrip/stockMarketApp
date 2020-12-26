'use strict';

// const baseController = require('../controller/baseController');
import {
	userNameCheckHandler,
	loginRouteHandler,
	userSessionCheckRouteHandler,
	registerRouteHandler,
	createCompany,
	listCompanies,
	listUserCompanies,
	listOtherCompanies,
	buyCompany,
	getMessagesRouteHandler,
	routeNotFoundHandler
} from "../controller/baseController";
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
		this.app.post('/usernameAvailable', userNameCheckHandler);
		this.app.post( '/register', registerRouteHandler );
		this.app.post( '/login', loginRouteHandler);
		this.app.post('/userSessionCheck', decodeBearerToken, userSessionCheckRouteHandler);

		//company data routes
		this.app.post( '/registerCompany', createCompany );
		this.app.get( '/listCompanies', listCompanies );
		this.app.get( '/listUserCompanies', decodeBearerToken, listUserCompanies );
		this.app.get( '/listOtherCompanies', decodeBearerToken, listOtherCompanies );
		this.app.post( '/buyCompany', decodeBearerToken, buyCompany );

		// miscellaneous routes
		this.app.post('/getMessages', decodeBearerToken, getMessagesRouteHandler);
		this.app.get('*', routeNotFoundHandler);
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;
