// TODO:
//  - add event table and, thus, change the bills
require('./database');

const express = require('express');
const cors = require('cors');

const app = express();

const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(routes);

module.exports = app;
