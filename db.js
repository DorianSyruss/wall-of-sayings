'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongoUri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
mongoose.connect(mongoUri, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  config: { autoIndex: false }
});

module.exports = {
  db: mongoose.connection,
  dbUri: mongoUri
};
