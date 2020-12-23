// const routeHandler = require('./../handlers/route-handler');
// import user from "../../controllers/routes-handler";
import {
    signUp as signUpRoute,
    login as loginRoute
} from "../controllers/user";
import {
    createCompany as createCompanyRoute
} from "../controllers/company";

export default class Routes{

    constructor(app){
		this.app = app;
	}

    /* creating app Routes starts */
    appRoutes() {
        // this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler);

        //userRoutes
		this.app.post( '/signUp', signUpRoute );
		this.app.post('/login', loginRoute );

        // generalRoutes
        this.app.post( '/registerCompany', createCompanyRoute );
		// this.app.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler);

		// this.app.post('/getMessages', routeHandler.getMessagesRouteHandler);

		// this.app.get('*', routeHandler.routeNotFoundHandler);		
    };

    routesConfig() {
        this.appRoutes();
	};
};