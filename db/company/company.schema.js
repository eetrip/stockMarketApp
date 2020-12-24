// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CompanySchema = new Schema(
    {
        someName: {
            type: String
        },
        someThing: {
            type: String
        }
    },
    {
        collection: 'companies'
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Companies', CompanySchema );
