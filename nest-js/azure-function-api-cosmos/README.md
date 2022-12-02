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

## Recipe

1. Create cosmosDB resource (serverless, not provisioned throughput)
2. Install @azure/cosmos and dotenv, and create an init script
3. Install @nestjs/azure-database

```bash
npm i --save @nestjs/azure-database
```

3. Add environment variables
4. Add script for setting up db
5. Add nest-js config module

```bash
npm i --save @nestjs/config
```

## References

1. (@nestjs/azure-database package)[https://github.com/nestjs/azure-database]
2. (dotenv package)[https://www.npmjs.com/package/dotenv]
