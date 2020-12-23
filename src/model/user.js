import Db from "../config/db";
const userModel = require('../db/users/users.schema');

export default class UserModel {

    constructor() {};

    signUp( data ) {
        return new Promise( async ( resolve, reject ) => {
            try {

                this.MongoDB = new Db();
                let userData = new userModel( data );

                userData.save()
                .then( user => {
                    resolve( user );
                    return user;
                })
                .catch( err => {
                    reject( err );
                });

            } catch( error ) {
                reject( error );
            };
        });
    };

    getUserByEmail( email ) {
        return new Promise( async( resolve, reject ) => {
            try {
                await this.MongoDB.onConnect();
                this.userModel.find({
                    email: email
                }).toArray( ( error, result ) => {
                    this.MongoDB.closeConnection();
                    if( error ) {
                        reject( error );
                    };
                    resolve( result );
                });
            } catch( error ) {
                reject( error );
            };
        });
    };

    userOnline( userId ) {
        return new Promise( async( resolve, reject ) => {
            try {
                await this.MongoDB.onConnect();
                this.userModel.findAndModify({
                    _id: userId
                }, [], { "$set": {'online': 'Y'}}, { new: true, upsert: true}, ( err, result ) => {
                    this.MongoDB.closeConnection();
                    if( err ) {
                        reject( err );
                    };
                    resolve( result.value );
                });
            } catch( error ) {
                reject( error );
            };
        });
    };
};