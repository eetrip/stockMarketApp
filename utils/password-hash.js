/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/
'use strict';
const bcrypt = require('bcryptjs');

class PasswordHash{

	createHash(password) {
		return bcrypt.hashSync(password, 10);
	};

	compareHash(password, hash) {
		return new Promise((resolve, reject) => {
		  bcrypt.compare(password, hash, (err, match) => {
			if (err) {
			  reject(err);
			  return;
			}
			resolve(match);
		  });
		});
	}
}

module.exports = new PasswordHash();
