'use strict';

const Quote = require('../models/quote');
const router = require('express').Router();
const HTTPStatus = require('http-status');
const dropProperties = require('lodash/omit');
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['owner', 'favoritedCount'];

//guest routes
router.get('/guest/quotes', listPublicQuotes);

//logged user specific routes
router.get('/me/quotes', user.is('auth'), listMyQuotes);
router.post('/me/quotes', user.is('auth'), createMyQuote);
router.get('/me/quotes/:id', user.is('auth'), getMyQuote);
router.delete('/me/quotes/:id', user.is('owner or admin'), deleteMyQuote);

//accessible with any role

//role based authorization
router.get('/quotes', user.is('admin'), listQuotes);
router.post('/quotes', user.is('admin'), createQuote);
router.get('/quotes/:id', user.is('admin'), getQuote);
router.put('/quotes/:id', user.is('owner or admin'), updateQuote);
router.delete('/quotes/:id', user.is('admin'), deleteQuote);

module.exports = router;

function listPublicQuotes(req, res, next) {
  Quote.find({ type: 'public' })
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}

function listMyQuotes(req, res, next) {
  Quote.find({ owner: req.user.id })
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}

function listQuotes(req, res, next) {
  Quote.find()
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}

function getQuote(req, res, next) {
  Quote.findById(req.params.id)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function getMyQuote(req, res, next) {
  const data = { owner: req.user.id, _id: req.params.id };
  Quote.findOne(data)
    .then(quote => {
      if (!quote) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quote);
    })
    .catch(err => next(err));
}

function createQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  data.type = 'public';
  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function createMyQuote(req, res, next) {
  let data = req.body;
  data = dropProperties(data, immutables);
  data.owner = req.user.id;
  data.type = 'private';

  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function deleteMyQuote(req, res, next) {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  Quote.findOneAndUpdate(req.params.id, data, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}
