'use strict';

const Uuidv4 = require('uuid/v4');

class Utils {
    /**
     * Check if obj is undefined.
     * @param obj
     * @returns {boolean}
     */
    static isUndefined (obj) {

        return typeof obj === 'undefined';
    }

    /**
     * Check obj is empty.
     * @param obj
     * @returns {boolean}
     */
    static isEmpty (obj) {

        if (obj === null) {
            return true;
        }

        if (Utils.isArray(obj) || Utils.isString(obj)) {
            return obj.length === 0;
        }
        return Object.keys(obj).length === 0;
    };

    /**
     * Check is array
     * @param obj
     * @returns {boolean}
     */
    static isArray (obj) {

        if (Array.isArray) {
            return Array.isArray(obj);
        }
        else {
            return toString.call(obj) === '[object Array]';
        }
    };

    /**
     * Check is object.
     * @param obj
     * @returns {boolean}
     */
    static isObject (obj) {

        const type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    /**
     * Weak check for obj to be string.
     * @param obj
     * @returns {boolean}
     */
    static isString (obj) {
        return typeof obj === 'string';
    };

    /**
     * Generate type id by current date.
     * @returns {string}
     */
    static generateTypeByDate () {

        return new Date().toISOString().slice(0, 10);
    }

    /**
     * Generate id - to implement strategies.
     * @param body
     * @param idKey
     * @returns {*}
     */
    static generateId (body, idKey) {

        if (Utils.isUndefined(body[idKey])) {
            const id = Uuidv4();
            body[idKey] = id;
        }
        return body[idKey];
    }

    /**
     * Get collection of items.
     * @param response
     * @returns {Array}
     */
    static getResults (response) {

        if (Utils.isUndefined(response.hits) || response.hits.total === 0) {
            return [];
        }
        const items = [];
        response.hits.hits.forEach((document) => {

            items.push(Utils.getSource(document));
        });
        return items;
    }

    /**
     * Get single result source from response.
     * @param response
     * @returns {{}}
     */
    static getResult (response) {

        if (Utils.isUndefined(response.hits) || response.hits.total === 0) {
            return {};
        }
        return Utils.getSource(response.hits.hits[0])
    }

    /**
     * Get source of a document.
     * @param document
     * @returns {{}}
     */
    static getSource (document) {

        if (Utils.isUndefined(document) || Utils.isUndefined(document._source)) {
            return {};
        }

        return document._source;
    }

    /**
     * Generate event name for model.
     * @param modelName
     * @param evt
     * @returns {string}
     */
    static generateEvtName (modelName, evt) {

        return modelName.toLowerCase() + '_' + evt;
    }
}

module.exports = Utils;