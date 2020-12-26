"use strict";
/*requiring mongodb node modules */
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const assert = require('assert');

mongoose.Promise = global.Promise;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

class Db{

	constructor(){
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
	}

	onConnect(){
		const mongoURL = process.env.DEV_DB_URL;
		return new Promise( (resolve, reject) => {
			mongoose.connect(mongoURL, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true
			}, (err, db) => {
				if (err) {
					reject(err);
				} else {
					assert.strictEqual(null, err);
					resolve([db,this.ObjectID]);
				}
			});
		});
	}
}
module.exports = new Db();
