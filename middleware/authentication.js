// import UserModel from "../model/users";
let userModel = require("../db/users/user.schema");
import { decodeToken } from "../utils/token";
import { ApplicationError } from "../utils/error";
const MongoDb = require("../config/db");


export const verifyBearerToken = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next (
            new ApplicationError (
                "Missing Authorization header with Bearer token",
                401
            )
        );
        return;
    };
    // strip the leading "Bearer " part from the rest of the token string
    const token = authHeader.substring("Bearer ".length);
    try {
        await MongoDb.onConnect();
        const decoded = await decodeToken(token);
        const user = await userModel.find(
            { _id: decoded.id },
            ( error, document ) => {
                if( error ){
                    return;
                };
            }
        );
        if (!user) {
            throw new ApplicationError("Not found");
        };
        res.locals.authData = decoded;
        next();
    } catch( err ) {
        // assume failed decoding means bad token string
        next( new ApplicationError("Could not verify token", 401 ) );
    }
};


export const decodeBearerToken = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    res.locals.authData = null;
    if (authHeader) {
        const token = authHeader.substring("Bearer ".length);
        if (token) {
            await MongoDb.onConnect();
            const decoded = await decodeToken(token);
            const user = await userModel.find(
                { _id: decoded.id },
                ( error, document ) => {
                    if( error ){
                        return;
                    };
                }
            );
            if (!user) {
                throw new ApplicationError("Bearer Token Key is Invalid");
            };
            res.locals.authData = decoded;
        };
    };
    next();
};