'use strict';

// -----> Possible permissions for collections <------

const { user } = require('../../auth/permissions');
const { Types } = require('../../models/quote');
const Roles = require('../../models/user').roles;

user.use('view', (req, res) => {
  //public quotes can be seen by any logged in user,
  //collaborators and owner covers private collections

  let query = { $or: [{
    collaborators: { $in: [req.user.id] }
  }, {
    owner: req.user.id
  }, {
    type: Types.Public
  }] };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

user.use('edit', (req, res) => {
  let query = { $or: [{
    collaborators: { $in: [req.user.id] }
  }, {
    owner: req.user.id
  }] };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

user.use('delete', (req, res) => {
  let query = {
    owner: req.user.id
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});
