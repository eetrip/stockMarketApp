'use strict';

const { reject } = require('lodash');
const companyModel = require('../db/company/company.schema');
const userCompanyModel = require('../db/company/usersCompany.schema');
const userModel = require('../db/users/user.schema');
const { ApplicationError } = require('../utils/error');
const CONSTANTS = require("../config/constants");

class BaseModel{

	constructor(){
		this.Mongodb = require("../config/db");
	}

	async userNameCheck( username ){
		try {
			JSON.stringify(username);
			await this.Mongodb.onConnect();
			let data = await userModel.find(
				{ username: username },
				( error, document ) => {
					if( error ) {
						return;
					}
				}
			);
			if( data && data.length > 0 ) {
				return data;
			} else {
				return null;
			}
		} catch (error) {
			reject(error)
		}
	}

	async getUserByName(username){
		try {
			await this.Mongodb.onConnect();
			let data = await userModel.find(
				{ username: username },
				( error, document ) => {
					if( error ) {
						return;
					}
				}
			);
			if( data ) {
				return data[0];
			};
		} catch ( error ){
			console.log(error);
		};
	};

	async makeUserOnline(userId){
		try {
			await this.Mongodb.onConnect();
			let data = await userModel.findOneAndUpdate(
				{ _id: userId },
				[],
				{ "$set": { 'online': 'Y'} },
				{ new: true, upsert: true },
				( error, result ) => {
					if( error ) {
						return error;
					};
				}
			);
			return data;
		} catch( error ) {
			console.log(error);
		}
	}

	registerUser(data){
		return new Promise( async (resolve, reject) => {
			try {
				await this.Mongodb.onConnect();
				let userData = new userModel( data );

				userData.save()
				.then( user => {
					resolve( user );
					return user;
				}).catch( err => {
					reject( err );
				});

			} catch (error) {
				reject(error)
			}
		});
	};

	async userSessionCheck(data){
		try {
			await this.Mongodb.onConnect();
			let sessionData = await userModel.find(
				{ _id: data.userId, online: 'Y' },
				( error, document ) => {
					if( error ) {
						return;
					};
				}
			);
			if( sessionData ) return sessionData;
		} catch( error ) {
			console.log(error)
		};
	};

	getUserInfo({userId,socketId = false}){
		let queryProjection = null;
		if(socketId){
			queryProjection = {
				"socketId" : true
			}
		} else {
			queryProjection = {
				"username" : true,
				"online" : true,
				'_id': false,
				'id': '$_id'
			}
		}
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('users').aggregate([{
					$match:  {
						_id : ObjectID(userId)
					}
				},{
					$project : queryProjection
				}
				]).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					socketId ? resolve(result[0]['socketId']) : resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	addSocketId( userId, socketId ) {
		return new Promise( async (resolve, reject) => {
			try {
				await this.Mongodb.onConnect();
				userModel.findByIdAndUpdate (
					{ _id : userId },
					{ socketId: socketId, online: "Y" },
					( err, result ) => {
						// DB.close();
						if( err ){
							reject(err);
						}
						resolve(result);
					}
				);
			} catch( error ) {
				reject(error)
			}
		});
	};


	async createCompany( data ) {
		return new Promise( async( resolve, reject ) => {
			try {
				await this.Mongodb.onConnect();
				let companyData = new companyModel( data );

				companyData.save().then( company => {
					// DB.close();
					resolve( company );
					return ( company );
				});

			} catch( error ) {
				reject( error );
		  	};
		});
	};


	async listCompanies() {
		try {
			await this.Mongodb.onConnect();
			let data = await companyModel.find();
			if( data ) return data;
		} catch( error ) {
			console.log( error );
		};
	};


	async listUserCompanies( userId ) {
		try {
			JSON.stringify( userId );
			await this.Mongodb.onConnect();
			const userCompanies = await userCompanyModel.find(
				{ userId: userId },
				( error, document ) => {
					if( error ) {
						return;
					};
				}
			);
			const companyIds = userCompanies.map( companyId => {
				return companyId.companyId;
			});
			const companies = await companyModel.find(
				{ _id: { $in: companyIds } }
			);
			if( companies && companies.length > 0 ) return companies;
		} catch( error ) {
			throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_MESSAGE );
		};
	};


	async listOtherCompanies( userId ) {
		try {
			JSON.stringify( userId );
			await this.Mongodb.onConnect();
			const userCompanies = await userCompanyModel.find(
				{ userId: userId },
				( error, document ) => {
					if( error ) {
						return;
					};
				}
			);
			const companyIds = userCompanies.map( companyId => {
				return companyId.companyId;
			});
			const companies = await companyModel.find(
				{ _id: { $nin: companyIds } }
			);
			if( companies && companies.length > 0 ) return companies;
		} catch( error ) {
			throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_MESSAGE );
		};
	};


	async buyCompany( data ) {
		return new Promise( async( resolve, reject ) => {
			try {
				await this.Mongodb.onConnect();
				let companyData = new userCompanyModel( data );

				companyData.save().then( company => {
					resolve( company );
					return( company );
				}).catch( err => {
					reject( err );
				});
			} catch( error ) {
				throw new ApplicationError( error, CONSTANTS.SERVER_ERROR_HTTP_CODE );
			};
		});
	};


  test( data ) {
    return new Promise( async( resolve, reject ) => {
      try {
        await this.Mongodb.onConnect();
        let companyData = new companyModel( data );

        companyData.save()
        .then( compnay => {
          // DB.close();
          resolve( compnay );
          return ( compnay );
        })
      } catch( error ) {
        reject( error );
      };
    });
  };
};

module.exports = new BaseModel();
