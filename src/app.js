require('./database');

const express = require('express');
const app = express();

const cors = require('cors');

const routes = require('./routes');

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
    return res.status(200).send();
  }
});

module.exports = app;
