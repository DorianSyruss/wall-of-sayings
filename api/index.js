'use strict';

const quotes = require('./quotes.js');
const users = require('./users.js');
const quoteCollections = require('./collections.js');

module.exports = app => {
  app.use('/api', quotes);
  app.use('/api', users);
  app.use('/api', quoteCollections);
};
