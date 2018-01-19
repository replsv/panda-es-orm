'use strict';

const ORM = require('./orm');
const Utils = require('./utils');
const Validate = require('./validate');
const Query = require('./query');
const EventEmitter = require('events').EventEmitter;

class Model extends EventEmitter{

    /**
     * Constructor.
     * @param name
     * @param index
     * @param type
     * @param idKey
     * @param validationSchema
     */
    constructor (name, index, type, idKey = 'id', validationSchema = null) {

        super();
        this._name = name;
        this._index = index;
        this._type = type || Utils.generateTypeByDate();
        this._idKey = idKey;
        this._connection = null;
        this._data = null;
        this._compiled = false;
        this._validationSchema = validationSchema;

        ORM.bindModel(this);
    }

    /**
     * Compile model and inject connection.
     * @param connection
     * @param logger
     */
    compile (connection, logger) {

        this.check();
        this._connection = connection;
        this._compiled = true;
        this._logger = logger;
    }

    /**
     * Check model integrity and settings.
     */
    check () {

        ['_name', '_index', '_type', '_idKey'].forEach((key) => {

            if (Utils.isEmpty(this[key]) || !Utils.isString(this[key])) {
                throw new Error('Invalid model property: ' + key);
            }
        });
    }

    /**
     * Get data field
     * @param field
     * @returns {*}
     */
    getData (field) {

        return !Utils.isEmpty(this.data) ? this._data[field] : null;
    }

    /**
     * Set field and it's value in the data bag.
     * @param field
     * @param value
     */
    setData (field, value) {

        if (Utils.isEmpty(this.data)) {
            this._data = {};
        }

        this.data[field] = value;
    }

    /**
     * Hydrate a copy-object of the current instance.
     * @param data
     * @returns {Model}
     */
    hydrate (data) {
        const object = Object.create(this);
        object.data = data;
        return object;
    }

    /**
     * Dispatch an event with various data.
     * @param evtName
     * @param evtData
     * @returns {*}
     */
    dispatchEvent (evtName, evtData) {

        return process.nextTick(() => {

            this.emit(Utils.generateEvtName(this.name, evtName), evtData);
        });
    }

    /**
     * Find documents and their results by conditions set.
     * @param conditions
     * @returns {Promise.<Array>}
     */
    async find (conditions) {

        const values = [];
        if (conditions.constructor.name !== 'Query') {
            throw new Error('Invalid conditions sent! Must be an instance of Query object instead');
        }

        try {
            const query = {
                index: this.index,
                type: this.type,
                body: conditions.body
            };

            await this.dispatchEvent('before_find', {query: query});
            const response = await Query.execute(this._connection, 'search', query);
            const items = Utils.getResults(response);
            await this.dispatchEvent('after_find', {items: items});

            items.forEach((data) => {

                values.push(this.hydrate(data));
            });
            return values;
        } catch (e) {
            this._logger.error(e);
        }

        return values;
    }

    /**
     * Find one by query.
     * @param conditions
     * @returns {Promise.<*>}
     */
    async findOne (conditions) {

        if (conditions.constructor.name !== 'Query') {
            throw new Error('Invalid conditions sent! Must be an instance of Query object instead');
        }
        try {
            const query = {
                index: this.index,
                type: this.type,
                body: conditions.body
            };

            await this.dispatchEvent('before_find_one', {query: query});
            const response = await Query.execute(this._connection, 'search', query);
            const result = Utils.getResult(response);
            await this.dispatchEvent('before_find_one', {query: query, result: result});

            return this.hydrate(result);
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }

    /**
     * Find one by id.
     * @param value
     * @returns {Promise.<*>}
     */
    async findOneById (value) {

        try {
            const body = {query: {term: {}}};
            body.query['term'][this.idKey] = {value: value};
            const query = {
                index: this.index,
                type: this.type,
                body: (new Query(body)).body,
                size: 1
            };

            await this.dispatchEvent('before_find_one_by_id', {query: query});
            const response = await Query.execute(this._connection, 'search', query);
            const result = Utils.getResult(response);
            await this.dispatchEvent('before_find_one_by_id', {query: query, result: result});

            return this.hydrate(result);
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }

    /**
     * Create document based on model's data in datastore.
     * @param body
     * @param callback
     */
    async create (body) {

        if ((Utils.isUndefined(body) || Utils.isEmpty(body)) && !Utils.isEmpty(this.data)) {
            body = this.data;
        }

        if (Utils.isEmpty(body)) {
            this._logger.info('Body is empty!');
            return false;
        }

        try {
            await this.validate(body);
            const query = {
                index: this.index,
                type: this.type,
                id: Utils.generateId(body, this.idKey), // auto-generated UUIDv4
                body: body,
            };

            const response = await Query.execute(this._connection, 'create', query);
            body._id = response._id; // attach ES id as it might be needed if it's randomly generated
            return this.hydrate(body);
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }

    /**
     * Update model data from datastore.
     * @param body
     * @param refresh Bool flag - will delete already existent document matched by id
     * @returns {Promise.<*>}
     */
    async update (body, refresh = false) {

        if ((Utils.isUndefined(body) || Utils.isEmpty(body)) && !Utils.isEmpty(this.data)) {
            body = this.data;
        }

        if (Utils.isUndefined(body[this.idKey])) {
            throw "Missing id field - cannot update document";
        }

        try {
            await this.validate(body);
            const exists = await Query.execute(this._connection, 'exists', {
                index: this.index,
                type: this.type,
                id: body[this.idKey]
            });
            if (!exists) {
                throw "Document does not exist " + body[this.idKey];
            }
            if (refresh) {
                await Query.execute(this._connection, 'delete', {
                    index: this.index,
                    type: this.type,
                    id: body[this.idKey]
                });

                return this.create();
            }
            else {
                await Query.execute(this._connection, 'index', {
                    index: this.index,
                    type: this.type,
                    id: body[this.idKey],
                    body: body
                });

                return this;
            }
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }

    /**
     * Delete model from data store.
     * @param body
     * @returns {Promise.<boolean>}
     */
    async delete (body) {

        if ((Utils.isUndefined(body) || Utils.isEmpty(body)) && !Utils.isEmpty(this.data)) {
            body = this.data;
        }

        if (Utils.isUndefined(body[this.idKey])) {
            throw "Missing id field - cannot delete document";
        }

        try {
            const exists = await Query.execute(this._connection, 'exists', {
                index: this.index,
                type: this.type,
                id: body[this.idKey]
            });
            if (!exists) {
                throw "Document does not exist " + body[this.idKey];
            }
            const status = await Query.execute(this._connection, 'delete', {
                index: this.index,
                type: this.type,
                id: body[this.idKey]
            });
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }

    /**
     * Validate data / body.
     * @param body
     * @returns {Promise.<void>}
     */
    async validate (body) {

        if (Utils.isUndefined(body) || Utils.isEmpty(body)) {
            body = this.data;
        }

        await this.dispatchEvent('before_validate', {body: body});
        this.data = body;
        Validate.validate(this);
    }

    /**
     * Getter
     * @returns {*}
     */
    get index () {

        return this._index;
    }

    /**
     * Getter
     * @returns {*|string}
     */
    get type () {
        return this._type;
    }

    /**
     * Getter
     * @returns {string|*}
     */
    get idKey () {
        return this._idKey;
    }

    /**
     * Getter
     * @returns {*}
     */
    get name () {
        return this._name;
    }

    /**
     * Getter
     * @returns {boolean}
     */
    get compiled () {
        return this._compiled;
    }

    /**
     * Getter
     * @returns {null|*}
     */
    get data () {
        return this._data;
    }

    /**
     * Setter
     * @param value
     */
    set data (val) {
        this._data = val;
    }

    /**
     * Getter
     * @returns {*}
     */
    get validationSchema () {
        return this._validationSchema;
    }

    /**
     * Setter
     * @param value
     */
    set validationSchema (value) {
        this._validationSchema = value;
    }
}

module.exports = Model;