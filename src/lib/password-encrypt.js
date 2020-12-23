'use strict';
import { hashSync, compareSync } from 'bcrypt';

class PasswordHash{

    createHash(password) {
        return hashSync(password, 10);
    };

    compareHash(password, hash) {
        return compareSync(password, hash)
	};
};

export default new PasswordHash();