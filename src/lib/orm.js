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
        this._version = 7;

        if (Utils.isUndefined(options.connection)) {
            throw new Error('Invalid options');
        }

        if (!Utils.isUndefined(options.connection.version)) {
            this._version = parseInt(options.connection.version);
        }
    }

    /**
     * Connect to ES.
     * @returns {Promise.<void>}
     */
    async connect () {

        this._connection = await Connection.createConnection(this._options.connection);
        try {
            await this._connection.ping();
            this._logger.info('Connected to ES');
        } catch (e) {
            this._logger.alert(e);
        }
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
            models[name].compile(this._connection, this._version, this._logger);
        }

        return Object.create(models[name]);
    }
}

module.exports = ORM;