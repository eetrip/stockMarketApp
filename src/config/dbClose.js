import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

export default class DbClose {

	constructor() {
        this.closeConnection();
    };

    closeConnection() {
        mongoose.connection.close(function () {
            console.log('Connection has been successfully closed, see you again soon!');
            process.exit(0);
        });
    }
};
// module.exports = new Db();