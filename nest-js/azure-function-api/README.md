# Nest.js Azure Function API

## Description

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Recipe

1. Build a basic nest.js api
2. Make sure you're using the correct node version
3. Install azure functions core tools

```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
# if upgrading on a machine that has 2.x or 3.x installed:
brew link --overwrite azure-functions-core-tools@4
```

4. Add nest function package

- pitfall 1: issues with azure router -> don't use it (github issue: https://github.com/nestjs/azure-func-http/issues/1019#issuecomment-1317370793)
- pitfall 2: issues with finding function script -> might have to rename the function, and set webPack config off in nest-cli.json file

5. Chang base route

- in main.azure.ts
- and add extensions.http.routePrefix setting in host.json

## References

1. [Azure functions js tutorial](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node)
2. [Core tools installation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)
