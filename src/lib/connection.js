'use strict';

const { Client: Client5 } = require('es5');
const { Client: Client6 } = require('es6');
const { Client: Client7 } = require('es7');

class Connection {

    /**
     * Create an ES connection.
     * @param options
     * @returns {esClient|*}
     */
    static createConnection (options) {

        let clientReference;
        if (options.version === 5) {
            clientReference = Client5;
        } else if (options.version === 6) {
            clientReference = Client6;
        } else { // default
            clientReference = Client7;
        }
        delete options.version;
        return new clientReference(options);
    }
}

module.exports = Connection;