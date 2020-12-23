import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let CompanySchema = new Schema(
    {
        companyName: {
            type: String
        },
        currentPrice: {
            type: Number
        },
        highest: {
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