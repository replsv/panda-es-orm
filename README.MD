# 🐼 ElasticSearch ORM

One simple ORM used for ES 5.*/6.*/7.* in order to easily manage your data.
All code resides under `src/lib` folder.

## How to use it?
Browse the examples section as it contains various cases. The ES connection is exposed therefore sky is the limit here, so you have a lot of flexibility.

## Components
### Connection
Initiate an ES connection and expose it to the plugin.
### Logger
Simple logger for internal usage. It supports various drivers which should implement logging methods present under the current console logger (lib/logger/console). The console logger is the default option.
Also, you can use other external packages such as *ain*.
### Query
Object wrapper for an ES query - it supports everything you might think of based on your ES knowledge. Also, by passing the connection reference, all queries are executed at this point.
### Model
Bounds a model instance by it's index and desired type. For missing ids on indexing new documents, uuid are generated and used in the query.
Another feature is that the Model class can be extended if there's any custom logic which needs to be put in place.
Management methods implemented:
- findOne
- findOneById
- find - returns a collection of current model's objects
- create - index a new document
- delete - deletes either a hydrated model / by identifier
- update - updates by state / body & identifier combination
Each action will dispatch before and after events through which you can modify data for various cases based on your current flow. The model class also extends the EventEmitter so all methods present there are available.
### ORM
Main element - initializes the ES connection, bounds each model, injects all dependencies and does some integrity/configuration checks.
### Utils
A list of internal functions used in order to check/decorate/parse things.
### Validate
A simple wrapper which uses joi schema validation. It's used for validating data before it gets written in the database accordingly on the provided schema for one model. This step is optional for your project and it only depends on your model configuration when it gets initialized.

## Events system
Data can be modified for models through event listeners attached on models.

## Configuration
The configuration is quite simple and for the moment it only addresses the ORM and the logger.

Eg.
```js
{
    connection: { // elasticsearch package config
        host: '10.10.10.1:9200',
        version: 7, // ES version (5, 6 or 7 are currently supported) / default version is 7 as of 1.0.0
        requestTimeout: 2000
    },
    logger: { // passed to the internal logger
        level: 10
    }
}
```

## Supported versions
- ElasticSearch 7.*, ElasticSearch 6.* -> note: for 
- NodeJS >=m 6.4.0

## Changelog
See the changelog file.

## Current versions
1.0.0 - added support for ES7; updated other dependencies used for validation of models
0.1.0 - first version (master)