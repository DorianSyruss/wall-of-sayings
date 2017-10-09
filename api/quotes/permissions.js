'use strict';

const { user } = require('../../auth/permissions');
const { Types } = require('../../models/quote');
const pickProperties = require('lodash/pick');
const get = require('lodash/get');
const Roles = require('../../models/user').roles;

const defaultLimit = 50;

user.use('listQuotes', (req, res) => {
  const properties = ['author', 'owner', 'type', 'tags', 'publishedAt'];
  const { author, owner, type, tags, publishedAt } = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  const user = req.user;
  let query = {};

  if (user) {
    const andQuery = [{
      $or: [
        { owner: user.id },
        { type: Types.Public }
      ]
    }];

    if (type) andQuery.push({ type });
    if (owner) andQuery.push({ owner });
    if (tags) andQuery.push({ tags });
    if (author) andQuery.push({ author });
    if (publishedAt) andQuery.push({ publishedAt });

    query = {
      $and: andQuery
    };

    if (user.role === Roles.Admin) query = {};

  } else query = { type: Types.Public };

  return req.ctx.getQuotes(query)
    .skip(offset)
    .limit(limit)
    .then(quotes => {
      if (quotes.length === 0) return false;
      req.ctx = req.ctx || {};
      req.ctx.quotes = quotes;
      return true;
    });
});

user.use('viewQuote', (req, res) => {
  //public quotes can be seen by any logged in user and guest,

  const andQuery = [{
    $or: [
      { owner: req.user.id },
      { type: Types.Public }
    ]
  }];

  let query = {
    $and: andQuery
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getQuote(query)
    .then(quote => {
      if (!quote) return false;
      req.ctx.quote = quote;
      return true;
    });
});

user.use('edit', (req, res) => {
  let query = {
    $or: [
      { owner: req.user.id }
    ]
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getQuote(query)
    .then(quote => {
      if (!quote) return false;
      req.ctx.quote = quote;
      return true;
    });
});

user.use('deleteQuote', (req, res) => {
  let query = {
    owner: req.user.id
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getQuote(query)
    .then(quote => {
      if (!quote) return false;
      req.ctx.quote = quote;
      return true;
    });
});

module.exports = { user };
