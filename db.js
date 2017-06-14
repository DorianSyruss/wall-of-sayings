'use strict';

const mongoose = require('mongoose');
const mongodbUri = require('mongodb-uri');
mongoose.Promise = require('bluebird');

const uri = mongodbUri.format({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  hosts: [{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }],
  database: process.env.DB_DATABASE
});

mongoose.connect(uri, {
  config: { autoIndex: false }
});

module.exports = {
  db: mongoose.connection,
  dbUri: uri
};
