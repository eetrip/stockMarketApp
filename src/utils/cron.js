'use strict';
const _ = require("lodash");
const cron = require("node-cron");
// let userModel = require("../db/users/user.schema");
let companyModel = require("../db/company/company.schema");

class CronClass {

    constructor() {
        this.Mongodb = require("../config/db");
        this.runCron();
    };

    async runCron() {
        await this.Mongodb.onConnect();
        // Creating a cron job which runs on every 5 second 
        cron.schedule("*/5 * * * * *", async function() {

            let multipliers = [ 0.95, 0.96, 0.97, 0.98, 0.99, 1.05, 1.10 ], i;
            let companyData = await companyModel.find();
            let multiplierValue = _.shuffle( multipliers );

            for( i = 0; i < companyData.length; i++ ) {
                companyData[i].currentPrice = companyData[i].currentPrice * multiplierValue[0];
                if( companyData[i].highestPrice < companyData[i].currentPrice ) {
                    companyData[i].highestPrice = companyData[i].currentPrice;
                };

                companyModel.findByIdAndUpdate(
                    companyData[i]._id,
                    companyData[i],
                    ( error, document ) => {
                        if( error ) {
                            return;
                        };
                    }
                );
            };
        });
    };
};

module.exports = CronClass;