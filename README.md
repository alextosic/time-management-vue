# Time Management Vue App

## Requirements

Node v10.15.3+

npm v6.9.0+

## Setup

Set the needed environment variables in app/.env for the server side, and web-app/.env for the client side (check the
.env.example in each folder to see which variables are needed). You can add any string for the JWT secret.

Install the packages

```bash
npm run client:install
npm run server:install
```

Create the database if needed

```bash
npm run sequelize-cli db:create
```

This will by default create the development database. If you want to create the database for the production or test
environment, explicitly define the NODE_ENV before calling this script, like this

```bash
NODE_ENV=production npm run sequelize-cli db:create
NODE_ENV=test npm run sequelize-cli db:create
```

Run the migrations

```bash
npm run sequelize-cli db:migrate
NODE_ENV=production npm run sequelize-cli db:migrate
NODE_ENV=test npm run sequelize-cli db:migrate
```

Run the seeders

```bash
npm run sequelize-cli db:seed:all
NODE_ENV=production npm run sequelize-cli db:seed:all
NODE_ENV=test npm run sequelize-cli db:seed:all
```

The email/password for the superadmin created by the seed are superadmin@toptal.com/toptalsuperadmin

To run the app in development mode, start the client and the server separately

```bash
npm run client:dev
npm run server:dev
```

Access the app at http://localhost:8080/

If you want to run the app in production mode, build the client files, and start the server in production mode

```bash
npm run client:prod
npm run server:prod
```

The app will now be located at http://localhost:3000/

## Documentation

Build the documentation

```bash
npm run server:apidoc
```

Access them at http://localhost:3000/docs/ after starting up the server,
or locate them in the /docs folder in the project

## Tests

Run the unit tests

```bash
npm run server:test:unit
```

Run the e2e tests

To run the e2e test, first build the client files, and run the server in test mode

```bash
npm run client:build
npm run server:test
```

then run the e2e tests

```bash
npm run server:test:e2e
```
