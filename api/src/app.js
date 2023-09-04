const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');
const history = require('connect-history-api-fallback');

const corsMiddleware = require('./middleware/corsMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const routes = require('./routes');

const app = express();

const docsPath = path.join(__dirname, '..', '..', 'docs');
const webAppPath = path.join(__dirname, '..', '..', 'web-app', 'dist');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', corsMiddleware.init(), routes);
app.use(errorMiddleware.handleErrors());

app.use('/docs', express.static(docsPath));

app.use(history());
app.use(express.static(webAppPath));

module.exports = app;
