'use strict';

const HTTPStatus = require('http-status');
const ConnectRoles = require('connect-roles');
const QuoteCollection = require('../models/quoteCollection');
const Roles = require('../models/user').roles;
const get = require('lodash/get');

const user = new ConnectRoles({
  async: true,
  failureHandler(req, res, action) {
    res.status(HTTPStatus.UNAUTHORIZED).send(`Not ${action}`);
  }
});

user.use('auth', req => req.isAuthenticated());

user.use('owner or admin', req => req.isAuthenticated() ? undefined : false);
user.use('owner or admin', req => get(req, 'user.role') === Roles.Admin ? true : undefined);
user.use('owner or admin', isOwner);

function isOwner(req) {
  return QuoteCollection.findById(req.params.id)
    .then((quoteCollection) => {
      if (!quoteCollection) return true;
      return get(req, 'user.id') === quoteCollection.owner.toString();
    });
}

module.exports = { user };
