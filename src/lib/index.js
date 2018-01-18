'use strict';

const Logger = require('./logger');
const Utils = require('./utils');
const Model = require('./model');
const SchemaValidator = require('./validate');
const ORM = require('./orm');
const Query = require('./query');

/**
 * Export libs.
 * @type {{orm: ORM, logger: Logger, validator: Validate, model: AbstractModel, utils: Utils}}
 */
module.exports = {
    orm: ORM,
    logger: Logger,
    validator: SchemaValidator,
    model: Model,
    query: Query,
    utils: Utils
};