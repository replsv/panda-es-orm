'use strict';

const plugin = require('../../index');
const Joi = require('joi');

/**
 * Define a joi-powered validation
 */
const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    year: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email()
});


// define a new class
class MyModel extends plugin.model {

    /**
     * Constructor.
     * @param name
     * @param index
     * @param type
     * @param idKey
     * @param validationSchema
     */
    constructor (name, index, type, idKey = 'id', validationSchema = schema) {

        super(name, index, type, idKey, validationSchema);
        this._newProperty = 'new property';
    }

    get newProperty () {
        return this._newProperty;
    }

    set newProperty (value) {
        this._newProperty = value;
    }

    newMethod () {

        console.log('this is my new model!');
    }
}

module.exports = MyModel;