'use strict';

const Quote = require('../models/quote');
const router = require('express').Router();
const HTTPStatus = require('http-status');
const dropProperties = require('lodash/omit');
const pickProperties = require('lodash/pick');
const { Types } = require('../models/quote');
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['owner', 'favoritedCount', 'favoritedBy', 'publishedOn'];
const defaultLimit = 50;

//guest routes
router.get('/guest/quotes', listPublicQuotes);
router.get('/guest/quotes/:id', getPublicQuote);

//logged user specific routes
router.post('/me/quotes', user.is('auth'), createMyQuote);
router.get('/me/quotes', user.is('auth'), listMyQuotes);
router.get('/me/quotes/:id', user.is('auth'), getMyQuote);
router.put('/me/quotes/:id', user.is('auth'), updateMyQuote);
router.delete('/me/quotes/:id', user.is('auth'), deleteMyQuote);

//accessible with any role

//role based authorization
router.get('/quotes', user.is('auth'), user.is('admin'), listQuotes);
router.post('/quotes', user.is('auth'), user.is('admin'), createQuote);
router.get('/quotes/:id', user.is('auth'), user.is('admin'), getQuote);
router.put('/quotes/:id', user.is('auth'), user.is('admin'), updateQuote);
router.delete('/quotes/:id', user.is('auth'), user.is('admin'), deleteQuote);

module.exports = router;

// -----> Guest routes, no login needed <------

function listPublicQuotes(req, res, next) {
  const properties = ['author', 'tags', 'publishedAt'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  query.type = Types.Public;
  Quote.find(query)
    .skip(offset)
    .limit(limit)
    .then(quotes => {
      if (!quotes.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quotes);
    })
    .catch(err => next(err));
}

function getPublicQuote(req, res, next) {
  const query = { _id: req.params.id, type: Types.Public };
  Quote.findOne(query)
    .then(quote => {
      if (!quote) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quote);
    })
    .catch((err) => next(err));
}

// -----> Logged user specific ('/me') routes <------

function createMyQuote(req, res, next) {
  let data = req.body;
  data = dropProperties(data, immutables);
  data.owner = req.user.id;
  data.type = Types.Private;

  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function listMyQuotes(req, res, next) {
  const properties = ['author', 'tags', 'publishedAt', 'type'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  query.owner = req.user.id;
  Quote.find(query)
    .skip(offset)
    .limit(limit)
    .then(quotes => {
      if (!quotes.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quotes);
    })
    .catch(err => next(err));
}

function getMyQuote(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  Quote.findOne(query)
    .then(quote => {
      if (!quote) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quote);
    })
    .catch(err => next(err));
}

function updateMyQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  const options = { new: true, runValidators: true };
  data.type = Types.Private;
  Quote.findByIdAndUpdate(req.params.id, data, options)
    .then(quote => {
      if (!quote) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quote);
    })
    .catch(err => next(err));
}

function deleteMyQuote(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  Quote.findByIdAndRemove(query)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

// -----> Role based routes, admin <------

function createQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  data.type = Types.Public;
  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function listQuotes(req, res, next) {
  const properties = ['author', 'tags', 'publishedAt', 'type'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  Quote.find(query)
    .skip(offset)
    .limit(limit)
    .then(quotes => {
      if (!quotes.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quotes);
    })
    .catch(err => next(err));
}

function getQuote(req, res, next) {
  Quote.findById(req.params.id)
    .then(quote => {
      if (!quote) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quote);
    })
    .catch(err => next(err));
}

function updateQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  const options = { new: true, runValidators: true };
  Quote.findOneAndUpdate(req.params.id, data, options)
    .then(quote => {
      if (quote.type === Types.Public) {
        quote.publish(quote.type);
      }
      res.status(HTTPStatus.OK).send(quote);
    })
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

