// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        username: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        socketId: {
            type: String
        },
        online: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection: 'users'
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Users', UserSchema);