import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let UserSchema = new Schema({
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
}, {
    collection: 'users'
});

module.exports = mongoose.model('Users', UserSchema);