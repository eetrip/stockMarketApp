'use strict';

const path = require('path');
const baseModel = require('../models/baseModel');
const CONSTANTS = require('../config/constants');
const usersCompanyModel = require('../db/company/usersCompany.schema');
const { ApplicationError } = require('../utils/error');

class Socket{

	constructor(socket){
		this.io = socket;
	}
	
	socketEvents(){

		this.io.on('connection', (socket) => {

			/* Get the user's company list	*/
			socket.on(`chat-list`, async (data) => {
				if (data.userId == '') {
					this.io.emit(`list`, {
						error : true,
						message : CONSTANTS.USER_NOT_FOUND
					});
				} else {
					try {
						const companyData = await baseModel.listUserCompanies( data.userId );
						const otherCompanyData = await baseModel.listOtherCompanies( data.userId );
						this.io.to(socket.id).emit(`list`, {
							error : false,
							companyList : companyData
						});
						this.io.to(socket.id).emit(`list`, {
							error : false,
							companyList : otherCompanyData
						});
					} catch ( error ) {
						this.io.to(socket.id).emit(`chat-list-response`,{
							error : true ,
							companyList : []
						});
					}
				}
			});


			/**
			* Logout the user
			*/
			socket.on('logout', async (data)=>{
				try{
					const userId = data.userId;
					await baseModel.logout(userId);
					this.io.to(socket.id).emit(`logout-response`,{
						error : false,
						message: CONSTANTS.USER_LOGGED_OUT,
						userId: userId
					});

				} catch (error) {
					throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
				};
			});


			socket.on('disconnect', async () => {
				socket.broadcast.emit(`list`,{
					error : false ,
					userDisconnected : true ,
					userid : socket.request._query['userId']
				});
				
			});

		});

	}
	
	socketConfig(){
		this.io.use( async (socket, next) => {
			try {
				await baseModel.addSocketId(
					userId = socket.request._query['userId'],
					socketId = socket.id
				);
				next();
			} catch (error) {
				// Error
				console.error(error);
          	};
        });

		this.socketEvents();
	};
};
module.exports = Socket;