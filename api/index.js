'use strict';

const auth = require('./auth');
const users = require('./users');
const quotes = require('./quotes');
const quoteCollections = require('./collections');


module.exports = app => {
  app.use('/api', auth);
  app.use('/api', users);
  app.use('/api', quotes);
  app.use('/api', quoteCollections);
};

