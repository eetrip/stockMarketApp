import Db from "../config/db";
import DbClose from "../config/dbClose";
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

                this.MongoDB = new Db();
                let user = await userModel.findOne({
                    email: email
                }).exec();

                resolve( user );
                return user;

            } catch( error ) {
                reject( error );
            };
        });
    };


    userOnline( userId ) {
        return new Promise( async( resolve, reject ) => {
            try {

                this.MongoDB = new Db();
                this.userModel.findAndModify({
                    _id: userId
                },
                [],
                {
                    "$set": {'online': 'Y'}
                },
                {
                    new: true,
                    upsert: true
                },
                ( err, result ) => {
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