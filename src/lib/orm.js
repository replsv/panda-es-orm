'use strict';

const Connection = require('./connection');
const Logger = require('./logger');
const Utils = require('./utils');
const Model = require('./model');
const Query = require('./query');

/**
 * Bound models.
 * @type {{}}
 */
const models = {};

class ORM {

    /**
     * Init ORM.
     * @param options
     */
    constructor (options) {
        this._options = options;
        this._logger = new Logger(options.logger);

        if (Utils.isUndefined(options.connection)) {
            throw new Error('Invalid options')
        }

        this.connect();
    }

    /**
     * Connect to ES.
     * @returns {Promise.<void>}
     */
    connect () {

        this._connection = Connection.createConnection(this._options.connection);
        this._connection.ping({}, (err) => {

            if (err) {
                this._logger.alert(err);
            } else {
                this._logger.info('Connected to ES');
            }
        })
    }

    /**
     * Disconnect from ES.
     */
    disconnect () {

        if (this._connection === null) {
            throw new Error('ES is not connected');
        }

        this._connection = null;
    }

    /**
     * Setter.
     * @param val
     */
    set options (val) {

        this._options = val;
    }

    /**
     * Getter.
     * @returns {*}
     */
    get options () {

        return this._options;
    }

    /**
     *
     * @returns {esClient|null}
     */
    get connection () {

        return this._connection;
    }

    /**
     * Bind model into ORM.
     * @param modelInstance
     * @returns {*}
     */
    static bindModel(modelInstance) {

        const name = modelInstance.name;
        if (!Utils.isUndefined(models[name])) {
            return models[name];
        }

        models[name] = modelInstance;
    }

    /**
     * Get bound model.
     * @param name
     * @returns {*|Model}
     */
    getModel(name) {

        if (Utils.isUndefined(models[name])) {
            throw new Error('Unknown model ' + name);
        }

        if (!models[name].compiled) {
            models[name].compile(this._connection, this._logger);
        }

        return models[name];
    }
}

module.exports = ORM;