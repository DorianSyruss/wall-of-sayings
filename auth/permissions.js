'use strict';

const HTTPStatus = require('http-status');
const ConnectRoles = require('connect-roles');
const QuoteCollection = require('../models/quoteCollection');
const Quote = require('../models/quote');
const Roles = require('../models/user').roles;
const get = require('lodash/get');

const user = new ConnectRoles({
  async: true,
  failureHandler(req, res, action) {
    res.status(HTTPStatus.UNAUTHORIZED).send(`Not ${action}`);
  }
});

// check roles strategies

user.use('auth', req => req.isAuthenticated());

user.use('admin', req => get(req, 'user.role') === Roles.Admin);

user.use('owner or admin', req => req.isAuthenticated() ? undefined : false);
user.use('owner or admin', req => get(req, 'user.role') === Roles.Admin ? true : undefined);
user.use('owner or admin', isCollectionOwner);
user.use('owner or admin', isQuoteOwner);

function isCollectionOwner(req) {
  return QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) return undefined;
      return get(req, 'user.id') === quoteCollection.owner.toString();
    });
}

function isQuoteOwner(req) {
  return Quote.findById(req.params.id)
    .then(quote => {
      if (!quote) return true;
      return get(req, 'user.id') === get(quote, 'owner');
    });
}

module.exports = { user };
