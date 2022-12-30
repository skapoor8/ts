# AzureFunctionApiMysqlTypeorm

## Using NX

1. creating workspace X
2. configure - apps and libs via nx.json X
3. creating apps and libs
4. starting and stopping apps

questions

1. why do libs need package.json
2. running scripts in packages from the project toplevel - rn running by going to project
3. issues when changing directory structure - expected path libs or something - issues was not running nx command line from project root
4. shared nodemodules vs separate by lib

## Using MikroORM

1. connecting
2. sharing entities? can't be done easily, object impedence mismatch
3. mikro config in db root
4. using cli with ts-node -> enable in config, less of a headache than compiling everything
5. migrations with cli
6. seeding data with cli
7. db dumps, imports and exports

lessons

1. setter for hidden props fucks things up
2. best way to serialize entities is manual. based on sub-entity initialization, you can control whether the prop serialized is named 'entity' or 'entityId'
3. debug: true in mikro config allows you to see queries being fired off
4. populateWhen: INFER in config ensures things aren't populated by default, avoid expensive joins

questions

1. Ref - doesn't seemt to work in toJSON
2. ts-morpth vs reflect-metadata for mikro - what are the differences
3. is the added complexity worth it...?
4. performance with mikro

pitfalls

1. typing for toObject is messed up
2. CORS errors cannot be caught:

```bash
Access to XMLHttpRequest at 'http://localhost:3333/api/users' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

GET http://localhost:3333/api/users net::ERR_FAILED 200
```

Just add handling

## Nest.js x Auth
