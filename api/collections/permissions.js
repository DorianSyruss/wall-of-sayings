'use strict';

// -----> Possible permissions for collections <------

const { user } = require('../../auth/permissions');
const { Types } = require('../../models/quote');
const pickProperties = require('lodash/pick');
const Roles = require('../../models/user').roles;

const defaultLimit = 50;

user.use('list', (req, res) => {
  const properties = ['owner', 'category', 'type'];
  const { owner, category, type } = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;

  const andQuery = [{
      $or: [
        { collaborators: { $in: [req.user.id] } },
        { owner: req.user.id },
        { type: Types.Public }
      ]
    }];

  if (category) andQuery.push({ category });
  if (type) andQuery.push({ type });
  if (owner) andQuery.push({ owner });

  let query = {
    $and: andQuery
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollections(query)
    .skip(offset)
    .limit(limit)
    .then(colls => {
      if (colls.length === 0) return false;
      req.ctx = req.ctx || {};
      req.ctx.collections = colls;
      return true;
    });
});

user.use('view', (req, res) => {
  //public quotes can be seen by any logged in user,
  //collaborators and owner covers private collections

  let query = {
    $or: [
      { collaborators: { $in: [req.user.id] } },
      { owner: req.user.id },
      { type: Types.Public }
    ]
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

user.use('edit', (req, res) => {
  let query = {
    $or: [
      { collaborators: { $in: [req.user.id] } },
      { owner: req.user.id }
    ]
  };

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

module.exports = { user };
