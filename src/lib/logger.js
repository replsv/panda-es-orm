'use strict';

const Utils = require('./utils');

// define severity levels
const ALERT = 1;  // Alert: action must be taken immediately
const ERR = 3;  // Error: error conditions
const WARN = 4;  // Warning: warning conditions
const NOTICE = 5;  // Notice: normal but significant condition
const INFO = 6;  // Informational: informational messages
const DEBUG = 7;  // Debug: debug messages

class Logger {

    /**
     * Constructor
     * @param options
     */
    constructor (options) {

        const driver = options.driver || 'console';
        const level = DEBUG;

        if (Utils.isUndefined(driver) || driver === 'console') {
            this._logger = require('./logger/console');
        }
        else if (!!driver && (typeof driver === 'object' || typeof driver === 'function')) {
            this._logger = driver;
        }
        else {
            this._logger = 0;
        }

        this._level = level;
    }

    /**
     * Format log msg.
     * @param msg
     * @param level
     * @returns {string}
     */
    formatLog (msg, level) {

        return (new Date()) + ' - ' + (level.toUpperCase()) + ' - ' + process.pid + ' - ' + (Utils.isString(msg) ? msg : JSON.stringify(msg));
    }

    /**
     * Debug - proxy call to driver.
     * @param msg
     */
    debug (msg) {

        if (this._level >= DEBUG) {
            msg = this.formatLog(msg, 'debug');
            this._logger.debug(msg);
        }
    }

    /**
     * Info - proxy call to driver.
     * @param msg
     */
    info (msg) {

        if (this._level >= INFO) {
            msg = this.formatLog(msg, 'info');
            this._logger.info(msg);
        }
    }

    /**
     * Error - proxy call to driver.
     * @param msg
     */
    error (msg) {

        if (this._level >= ERR) {
            msg = this.formatLog(msg, 'error');
            this._logger.error(msg);
        }
    }

    /**
     * Notice - proxy call to driver.
     * @param msg
     */
    notice (msg) {

        if (this._level >= NOTICE) {
            msg = this.formatLog(msg, 'notice');
            this._logger.notice(msg);
        }
    }

    /**
     * Warn - proxy call to driver.
     * @param msg
     */
    warn (msg) {

        if (this._level >= WARN) {
            msg = this.formatLog(msg, 'warn');
            this._logger.warn(msg);
        }
    }

    /**
     * Alert - proxy call to driver.
     * @param msg
     */
    alert (msg) {

        if (this._level >= ALERT) {
            msg = this.formatLog(msg, 'alert');
            this._logger.alert(msg);
        }
    }
}

module.exports = Logger;