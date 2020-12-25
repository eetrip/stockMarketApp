// import { Db } from "mongodb";
import Db from "../config/db";
let userModel = require('../db/users/users.schema');

export default class SocketModel {

    constructor() {};

    addSocketId({ userId, socketId }) {
        const data = {
            id: userId,
            value: {
                $set: {
                    socketId: socketId,
                    online: 'Y'
                }
            }
        };
        return new Promise( async( resolve, reject ) => {
            try {
                this.MongoDb = new Db();
                let userData = new userModel();
                userData.update(
                    { _id: ObjectID( data.id ) },
                    data.value,
                    ( err, result ) => {
                        if( err ) {
                            reject( err )
                        }
                        resolve( result );
                    }
                )
            } catch( error ) {
                reject( error );
            };
        });
    };
};