// import { default as SocketModel } from "../model/socket";
import SocketModel from "../model/socket";
import CONSTANTS from "../lib/constants";
import UserModel from "../model/user";
import CompanyModel from "../model/company";

class Socket {
    constructor( socket ) {
        this.io = socket;
    };

    socketEvents(){

        this.io.on('connection', ( socket ) => {

            socket.on( `list`, async( data ) => {
                if( data.userId === '' ) {
                    this.io.emit( `list-response`, {
                        error: true,
                        message: CONSTANTS.USER_NOT_FOUND
                    });
                } else {
                    try {
                        let companyDb = new CompanyModel();
                        const list = await Promise.all([
                            companyDb.list({
                                userId: data.userId,
                                socketId: false
                            })
                        ]);
                        this.io.to( socketId ).emit(`list-response`, {
                            error: false,
                            singleUser: true,
                            list: list
                        });
                    } catch( error ) {
                        this.io.to( socketId ).emit
                    }
                }
            })
        })
    };

    socketConfig() {
        this.io.use( async( socket, next ) => {
            try {
                let socketDb = new SocketModel();
                await socketDb.addSocketId({
                    userId: socket.request._query['userId'],
                    socketId: socket.id
                });
                next();
            } catch( error ) {
                console.log( error );
            };
        });
        this.socketEvents();
    };
}