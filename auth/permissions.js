'use strict';

const HTTPStatus = require('http-status');
const ConnectRoles = require('connect-roles');
const Roles = require('../models/user').roles;
const get = require('lodash/get');

const user = new ConnectRoles({
  failureHandler(req, res, action) {
    res.status(HTTPStatus.UNAUTHORIZED).send(`Not ${action}`);
  }
});

user.use('auth', req => req.isAuthenticated());

user.use('auth/admin', req => req.isAuthenticated() ? undefined : false);
user.use('auth/admin', req => get(req, 'user.role') === Roles.Admin);

user.use('owner or admin', req => req.isAuthenticated() ? undefined : false);
user.use('owner or admin', req => get(req, 'user.role') === Roles.Admin ? true : undefined);
user.use('owner or admin', req => get(req, 'user.id') === get(req, 'query.owner'));



module.exports = { user };
