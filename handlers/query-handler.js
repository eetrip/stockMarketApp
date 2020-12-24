'use strict';

let companyModel = require('../db/company/company.schema');
const userModel = require('../db/users/user.schema');
class QueryHandler{

	constructor(){
		this.Mongodb = require("./../config/db");
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

	addSocketId({userId, socketId}){
		const data = {
			id : userId,
			value : {
				$set :{
					socketId : socketId,
					online : 'Y'
				}
			}
		};
		return new Promise( async (resolve, reject) => {
			try {
				await this.Mongodb.onConnect();
				userModel.findByIdAndUpdate( { _id : data.id }, data.value ,(err, result) => {
					// DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
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


	getChatList(userId){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('users').aggregate([{
					$match: {
						'socketId': { $ne : userId}
					}
				},{
					$project:{
						"username" : true,
						"online" : true,
						'_id': false,
						'id': '$_id'
					}
				}
				]).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	};


	insertMessages(messagePacket){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('messages').insertOne(messagePacket, (err, result) =>{
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	};


	getMessages({userId, toUserId}){
		const data = {
				'$or' : [
					{ '$and': [
						{
							'toUserId': userId
						},{
							'fromUserId': toUserId
						}
					]
				},{
					'$and': [
						{
							'toUserId': toUserId
						}, {
							'fromUserId': userId
						}
					]
				},
			]
		};
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('messages').find(data).sort({'timestamp':1}).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	logout(userID,isSocketId){
		const data = {
			$set :{
				online : 'N'
			}
		};
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				let condition = {};
				if (isSocketId) {
					condition.socketId = userID;
				}else{
					condition._id = ObjectID(userID);
				}
				DB.collection('users').update( condition, data ,(err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
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

module.exports = new QueryHandler();
