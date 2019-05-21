'use strict';

const Joi = require('@hapi/joi');
const Utils = require('./utils');

class Validate {

    /**
     * Validate model.
     * @param modelInstance
     * @returns {boolean}
     */
    static validate(modelInstance) {

        if (Utils.isEmpty(modelInstance.validationSchema) || Utils.isUndefined(modelInstance.validationSchema)) {
            return true;
        }

        const result = Joi.validate(modelInstance.data, modelInstance.validationSchema);

        if (result.error !== null) {
            throw result.error;
        }
    }
}

module.exports = Validate;