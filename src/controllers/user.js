import CONSTANTS from "../lib/constants";
import route from "../routes/route";
import UserModel from "../model/user";
import passwordHash from "../lib/password-encrypt"

export const signUp = route( async( req, res ) => {

    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    // make status value from constants
    if( data.email ==='' ) {
        res.status( 200 ).json({
            error: true,
            message: CONSTANTS.USERNAME_NOT_FOUND
        });
    } else if ( data.password === '' ) {
        res.status( 200 ).json({
            error: true,
            message: CONSTANTS.PASSWORD_NOT_FOUND
        });
    } else {
        try {
            data.online = 'Y';
            data.socketId = '';
            data.password = passwordHash.createHash(data.password);
            const userDb = new UserModel();
            const result = await userDb.signUp( data );

            if( result === null || result === undefined ) {
                res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json({
                    error: true,
                    message: CONSTANTS.USER_REGISTRATION_FAILED
                });
            } else {
                res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json({
                    error: false,
                    userId: result.insertedId,
                    message: CONSTANTS.USER_REGISTRATION_SUCCESSFULL
                });
            };
        } catch( error ) {
            res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
                error: true,
                message: CONSTANTS.SERVER_ERROR_MESSAGE
            });
        };
    };

});

export const login = route( async( req, res ) => {

    const data = {
        email: ( req.body.email ).toLowerCase(),
        password: req.body.password
    };
    if( data.email === '' || data.email === null ) {
        res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
            error: true,
            message: CONSTANTS.USERNAME_NOT_FOUND
        });
    } else if( data.password === '' || data.password === null ) {
        res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
            error: true,
            message: CONSTANTS.PASSWORD_NOT_FOUND
        });
    } else {
        try {
            const userDb = new UserModel();
            const result = await userDb.getUserByEmail( data.email );
            if( result === null || result === undefined ) {
                res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
                    error: true,
                    message: CONSTANTS.USER_LOGIN_FAILED
                });
            } else {
                if( passwordHash.compareHash( data.password, result.password )) {
                    await userDb.userOnline( result._id );
                    res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json({
                        error: false,
                        userId: result._id,
                        message: CONSTANTS.USER_LOGIN_OK
                    });
                } else {
                    res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
                        error: true,
                        message: CONSTANTS.USER_LOGIN_FAILED
                    });
                };
            };
        } catch( error ) {
            res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
                error: true,
                message: CONSTANTS.USER_LOGIN_FAILED
            });
        };
    };
});