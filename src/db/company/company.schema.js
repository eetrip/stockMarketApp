// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CompanySchema = new Schema(
    {
        companyName: {
            type: String
        },
        highestPrice: {
            type: Number
        },
        shares: {
            type: Number
        },
        currentPrice: {
            type: Number
        },
        totalValue: {
            type: Number
        },
        status: {
            type: Number,
            default: 1
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
