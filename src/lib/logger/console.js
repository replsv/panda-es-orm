'use strict';

class ConsoleLogger {

    /**
     * Info
     * @param msg
     */
    static info (msg) {

        console.info(msg);
    }

    /**
     * Error
     * @param msg
     */
    static error (msg) {

        console.error(msg);
    }

    /**
     * Warn
     * @param msg
     */
    static warn (msg) {

        console.warn(msg);
    }

    /**
     * Debug
     * @param msg
     */
    static debug (msg) {

        console.debug(msg);
    }

    /**
     * Alert
     * @param msg
     */
    static alert (msg) {

        console.log(msg);
    }
}

module.exports = ConsoleLogger;