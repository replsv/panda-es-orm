'use strict';

const ElasticSearch = require('elasticsearch');

class Connection {

    /**
     * Create an ES connection.
     * @param options
     * @returns {esClient|*}
     */
    static createConnection (options) {

        return new ElasticSearch.Client(options);
    }
}

module.exports = Connection;