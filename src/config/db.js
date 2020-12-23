import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

export default class Db {

	constructor() {
        this.onConnect();
    };

	onConnect() {
		const mongoURL = process.env.DB_URL;
		return new Promise( ( resolve, reject ) => {
            mongoose.connect( mongoURL, {
                useNewUrlParser: true
            }).then(
                () => {
                    console.log(`
                    Database is connected
                    `);
                },
                err => {
                    console.log(`
                    There was a problem while connecting to database
                    ` + err 
                    );
                }
            );
		});
    };

    closeConnection() {
        mongoose.connection.close(function () {
            console.log('Connection has been successfully closed, see you again soon!');
            process.exit(0);
        });
    }
};
// module.exports = new Db();