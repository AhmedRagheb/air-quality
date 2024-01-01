## Description

- REST API responsible for exposing “the air quality information” of a nearest city to GPS coordinates using iqair :
https://www.iqair.com/fr/commercial/air-quality-monitors/airvisual-platform/api

- Check API doc from this [swagger](http://localhost:5000/api)

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

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technical notes

- MongoDB is used for DB.
- Factory pattern is used to decide which prrovider we will use to get data, in our case it is one provider now, but can be more in the future.
- API key and DB credentials are saved in `.env` file for testing, in production and real scenario this should be saved in secret manager.
