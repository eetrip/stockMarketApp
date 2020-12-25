import Db from "../config/db";
import DbClose from "../config/dbClose";
import companyModel from "../db/company/company.schema";
import { INTERNAL_SERVER_ERROR_HTTP_CODE } from "../lib/constants";
import { ApplicationError } from "../lib/errors";

export default class CompanyModel {

    constructor() {};

    create( data ) {
        return new Promise( async( resolve, reject ) => {
            try {

                this.MongoDB = new Db();
                let companyData = new companyModel( data );
    
                companyData.save()
                .then( company => {
                    resolve( company );
                    return company;
                })
                .catch( err => {
                    console.log( err );
                });
    
            } catch( error ) {
                throw new ApplicationError( error, INTERNAL_SERVER_ERROR_HTTP_CODE )
            };
        });
    };

    list() {
        return new Promise( async( resolve, reject ) => {
            try {
                let MongoDB = new Db();
                companyModel
            }
        })
    }
};