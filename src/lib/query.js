'use strict';

class Query {

    constructor (body) {

        this._body = body;
    }

    /**
     * Getter
     * @returns {*}
     */
    get body () {
        return this._body;
    }

    /**
     * Execute operation for a passed connection.
     * @param connection
     * @param operation
     * @param query
     * @returns {*}
     */
    static execute (connection, operation, query) {

        return connection[operation](query);
    }
}

module.exports = Query;