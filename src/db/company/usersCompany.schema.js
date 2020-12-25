// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserCompanySchema = new Schema(
    {
        companyId: {
            type: String
        },
        userId: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection: 'userCompanies'
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('UserCompanies', UserCompanySchema );
