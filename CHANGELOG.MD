# Changelog

1.0.0 - upgrade
```
- upgraded dependencies to use latest stable versions
- moved connect on ORM out of constructor
- using scoped imports for joi from @hapi (validation library)
- supporting various versions of elasticsearch: 5 and 6 (similar API), 7 (read docs - types are deprecated)
- changed the way models are initialised
```

0.2.1 - Fixed events and stability release
```
- fixed event order
```

0.1.0 - first version (master)
```
- implemented a small ORM built over ES and the official *elasticseach* plugin
- supports internal logging
- supports bundling other logging systems
- configuration is mainly used for the logger and the ES client instance
- supports validation using joi schemas
```