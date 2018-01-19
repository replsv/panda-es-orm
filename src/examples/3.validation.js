'use strict';

const plugin = require('../../index');
const Model = require('./2.model');

const bogusData = {
    username: 'John',
    year: 1978,
    email: 'invalid email'
};


(async () => {

    const instance = new Model('MyModel');
    instance.data = bogusData;

    try {
        await instance.validate();
        console.log('Model data is valid');
    } catch (e) {
        console.log('Error' + e);
    }
})();

// validate a dummy model with no validation at all
(async () => {

    const dummyInstance = new plugin.model('DummyModel');
    dummyInstance.data = bogusData;

    try {
        await dummyInstance.validate();
        console.log('Dummy model data is valid');
    } catch (e) {
        console.log('Error' + e);
    }
})();