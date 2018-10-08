'use strict';

const Quote = require('../../models/quote');
const router = require('express').Router();
const HTTPStatus = require('http-status');
const dropProperties = require('lodash/omit');
const { Types } = require('../../models/quote');
const { user } = require('./permissions');
const Roles = require('../../models/user').roles;
const { setContextOne, setContextMany } = require('../helpers');

//props to omit for this data model, safety measure
const immutables = ['owner', 'favoritedCount', 'favoritedBy', 'publishedOn'];

router.post('/quotes', user.is('auth'), createQuote);

//role based authorization
router.get('/quotes',
  setContextMany(Quote, 'getQuotes'),
  user.can('listQuotes'),
  listQuotes
);

router.get('/quotes/:id',
  user.is('auth'),
  setContextOne(Quote, 'getQuote'),
  user.can('viewQuote'),
  getQuote
);

router.put('/quotes/:id',
  user.is('auth'),
  setContextOne(Quote, 'getQuote'),
  user.can('edit'),
  updateQuote
);

router.delete('/quotes/:id',
  user.is('auth'),
  setContextOne(Quote, 'getQuote'),
  user.can('deleteQuote'),
  deleteQuote
);

module.exports = router;

// -----> Role based routes, admin <------

function createQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);

  if (req.user.role === Roles.Admin) data.type = Types.Public;
  else {
    data.type = Types.Private;
    data.owner = req.user.id;
  }

  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function listQuotes(req, res, next) {
  const quotes = req.ctx.quotes;
  res.status(HTTPStatus.OK).send(quotes);
}

function getQuote(req, res, next) {
  const quote = req.ctx.quote;
  res.status(HTTPStatus.OK).send(quote);
}

function updateQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  const quote = req.ctx.quote;

  if (req.user.role === Roles.User) data.type = Types.Private;

  quote.set(data);
  quote.save()
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));

}

function deleteQuote(req, res, next) {
  const quote = req.ctx.quote;

  quote.remove()
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

