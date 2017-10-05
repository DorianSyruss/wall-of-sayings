'use strict';

const auth = require('./auth');
const users = require('./users');
const quotes = require('./quotes');
const collections = require('./collections/index');
const publicCollections = require('./collections/public');
const userCollections = require('./collections/user');


module.exports = app => {
  app.use('/api', auth);
  app.use('/api', users);
  app.use('/api', quotes);
  app.use('/api', collections);
  app.use('/api', publicCollections);
  app.use('/api', userCollections);
};

