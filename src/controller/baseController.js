import { ApplicationError } from "../utils/error";
import route from "../routes/route";
import { generateToken, decodeToken } from "../utils/token";
const baseModel = require('../models/baseModel');
const CONSTANTS = require('../config/constants');
const passwordHash = require('../utils/password-hash');

'use strict';

export const userNameCheckHandler = route( async( request, response ) => {
		const username = (request.body.username).toLowerCase();
		if (username === "") {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		} else {
			try {
				const count = await baseModel.userNameCheck( username );
				if (count && count.length > 0) {
					response.status(200).json({
						error : true,
						message : CONSTANTS.USERNAME_AVAILABLE_FAILED
					});
				} else {
					response.status(200).json({
						error : false,
						message : CONSTANTS.USERNAME_AVAILABLE_OK
					});
				}
			} catch ( error ){
				response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	});

export const loginRouteHandler = route( async( request, response ) => {
		const data = {
			username : (request.body.username).toLowerCase(),
			password : request.body.password
		};
		if(data.username === '' || data.username === null) {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		}else if(data.password === '' || data.password === null) {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.PASSWORD_NOT_FOUND
			});
		} else {
			try {
				const result = await baseModel.getUserByName(data.username);
				if( result ===  null || result === undefined ) {
					response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
						error : true,
						message : CONSTANTS.USER_LOGIN_FAILED
					});
				} else {
					if( passwordHash.compareHash(data.password, result.password)) {
						const token = await generateToken(result._id);
						result.token = token;
						await baseModel.makeUserOnline(result._id);
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							userId : result._id,
							token: result.token,
							message : CONSTANTS.USER_LOGIN_OK
						});
					} else {
						response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
							error : true,
							message : CONSTANTS.USER_LOGIN_FAILED
						});
					}
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_LOGIN_FAILED
				});
			}
		}
	});

export const registerRouteHandler = route( async( request, response ) => {
		const data = {
			username: request.body.username,
			firstName : request.body.firstName,
			lastName : request.body.lastName,
			email : request.body.email,
			password : request.body.password
		};
		if(data.username === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		}else if(data.password === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.PASSWORD_NOT_FOUND
			});
		} else {
			try {
				data.online = 'Y' ;
				data.socketId = '' ;
				data.password = passwordHash.createHash(data.password);
				const result = await baseModel.registerUser(data);
				if (result === null || result === undefined) {
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error : false,
						message : CONSTANTS.USER_REGISTRATION_FAILED
					});
				} else {
					const token = await generateToken(result.insertedId);
					result.token = token;
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error : false,
						userId : result.insertedId,
						token: result.token,
						message : CONSTANTS.USER_REGISTRATION_OK
					});
				}
			} catch ( error ) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	});

export const userSessionCheckRouteHandler = route( async( request, response ) => {
		let userId = request.body.userId;
		if (userId === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
		} else {
			try {
				const result = await baseModel.userSessionCheck({ userId : userId });
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					username : result.username,
					message : CONSTANTS.USER_LOGIN_OK
				});
			} catch(error) {
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	});

export const getMessagesRouteHandler = route( async( request, response ) => {
		const userId = request.body.userId;
		const toUserId = request.body.toUserId;
		if (userId == '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
		}else{
			try {
				const messagesResponse = await baseModel.getMessages({
					userId:userId,
					toUserId: toUserId
				});
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					messages : messagesResponse
				});
			} catch ( error ){
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					messages : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	});


export const createCompany = route( async( req, res ) => {
	try {
		const data = req.body;
		const result = await baseModel.createCompany( data );
		res.status(200).json( result );
	} catch ( error ) {
		throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
	};
});


export const listCompanies = route( async( req, res ) => {
	try {
		const result = await baseModel.listCompanies();
		if( result ) res.status( 200 ).json( result );
	} catch( error ) {
		throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
	};
});


export const listUserCompanies = route( async( req, res ) => {
	try {
		let userId = res.locals.authData.id;
		const result = await baseModel.listUserCompanies( userId );
		if( result ) res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json( result );
	} catch( error ) {
		throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
	};
});


export const listOtherCompanies = route( async( req, res ) => {
	try {
		let userId = res.locals.authData.id;
		const result = await baseModel.listOtherCompanies( userId );
		if( result ) res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json( result );
	} catch( error ) {
		throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
	};
});


export const buyCompany = route( async( req, res ) => {
		try {
			const data = req.body;
			data.userId = res.locals.authData.id;
			const result = await baseModel.buyCompany( data );
			if( result ) res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json( result );
		} catch( error ) {
			throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
		};
	});


export const routeNotFoundHandler = route( async( request, response ) => {
		res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
			error : true,
			message : CONSTANTS.ROUTE_NOT_FOUND
		});
	});