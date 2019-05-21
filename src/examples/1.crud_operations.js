'use strict';

const plugin = require('../../index');

const options = {
    connection: {
        node: 'http://10.10.10.19:9212',
        version: 7
    },
    logger: {
        level: 10
    }
};

// start plugin - connect to es etc
const panda = new plugin.orm(options);

// define model and bind to orm
class Product extends plugin.model {

}
new Product({
    name: 'ProductModel', index: 'products', idKey: 'sku'
});

// get one item by configured id
(async () => {

    let responseObject = await panda.getModel('ProductModel').findOneById('JUC020593');

    console.log('###############');
    console.log('### 1 Get one product by sku');
    // get entire object data - responseObject is a clone of the initial model hydrated with fetched data from ES
    // console.log(JSON.stringify(responseObject.data));

    // get one field
    if (responseObject) {
        console.log(responseObject.getData('sku'));
    }
    else {
        console.log('NO DOCUMENT RETRIEVED');
    }
    console.log('###############');
})();

// get one item by query
(async () => {

    const query = new plugin.query({
        query: {
            term: {
                sku: {
                    value: 'JUC020593'
                }
            }
        }
    });
    let responseObject = await panda.getModel('ProductModel').findOne(query);

    console.log('###############');
    console.log('### 2 Get one item by query');

    // get one field
    if (responseObject) {
        console.log(responseObject.getData('sku'));
    }
    else {
        console.log('NO DOCUMENT RETRIEVED');
    }
    console.log('###############');
})();

// get collection of items
(async () => {

    const query = new plugin.query({
        query: {
            bool: {
                must: [
                    {
                        term: {
                            status: {
                                value: 1
                            }
                        }
                    },
                    {
                        range: {
                            price: {
                                gte: 6700
                            }
                        }
                    }
                ]
            }
        },
        _source: ['sku', 'price', 'id'],
        size: 10
    });
    let collection = await panda.getModel('ProductModel').find(query);

    console.log('###############');
    console.log('### 3 Get collection of items');

    // get one field
    if (collection.length > 0) {
        console.log(`Retrieved ${collection.length} documents`);
        collection.forEach((document) => {

            console.log(`- # ${document.getData('id')} ${document.getData('sku')} - ${document.getData('price')}`);
        })
    }
    else {
        console.log('NO DOCUMENTS RETRIEVED');
    }
    console.log('###############');
})();

// use event listeners
(async () => {

    const modelInstance = panda.getModel('ProductModel');

    // attach a listener
    modelInstance.on('productmodel_before_find', (evtData) => {

        console.log('Listening for: productmodel_before_find');
        console.log('Data: ' + JSON.stringify(evtData));
        // modify the queried ES type
        evtData.query.index = 'products_old';
    });

    let responseObject = await modelInstance.findOneById('JUC020593');

    console.log('###############');
    console.log('### 4 Test event listener');
    // get entire object data - responseObject is a clone of the initial model hydrated with fetched data from ES
    // console.log(JSON.stringify(responseObject.data));

    // get one field
    if (responseObject) {
        console.log(responseObject.getData('sku'));
    }
    else {
        console.log('NO DOCUMENT RETRIEVED');
    }
    console.log('###############');
})();

// create a new item
(async () => {
    
    await panda.connect();

    // declare model
    new plugin.model({
        name: 'BogusModel',
        index: 'bogus',
        idKey: 'id'
    });

    // 
    const modelInstance = panda.getModel('BogusModel');

    // attach a listener
    modelInstance.on('bogusmodel_before_validate', (evtData) => {

        console.log('Listening for: bodusmodel_before_validate');
        console.log('Data: ' + JSON.stringify(evtData));
        // modify the queried ES type
        evtData.body.createdAt = new Date();
    });

    console.log('###############');
    console.log('### 5 Test creating a new document');

    const responseObject = await modelInstance.create({id: Math.random(), title: 'Test', description: 'Lorem ipsum...'});
    if (responseObject) {
        console.log('DOCUMENT SAVED', JSON.stringify(responseObject));
    }
    else {
        console.log('NO DOCUMENT SAVED', responseObject);
    }
    console.log('###############');

    const hydratedModel = await modelInstance.findOne(new plugin.query({
        query: {
            term: {
                title: {
                    value: 'test'
                }
            }
        },
        size: 1
    }));

    console.log('###############');
    console.log('### 6 Update a hydrated model');

    if (hydratedModel) {
        console.log('Found data and hydrated a model');
        console.log('Data: ' + JSON.stringify(hydratedModel.data) + ' / Title: ' + hydratedModel.getData('title'));
        hydratedModel.setData('title', 'Test updated ' + new Date());
        const status = await hydratedModel.update(undefined, false);
        if (!status) {
            console.log('COULD NOT UPDATE MODEL');
        }
        console.log(hydratedModel.getData('title'));
    }
    else {
        console.log('NO DOCUMENT FOUND');
    }
    console.log('###############');
})();
