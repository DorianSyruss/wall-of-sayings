'use strict';

const quotes = require('./quotes');
const users = require('./users');

const quoteCollections = require('./collections.js');

module.exports = app => {
  app.use('/api', quotes);
  app.use('/api', users);
  app.use('/api', quoteCollections);
};
