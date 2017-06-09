'use strict';

const Quote = require('../models/quote');
const router = require('express').Router();
const HTTPStatus = require('http-status');
const dropProperties = require('lodash/omit');
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['owner'];

router.get('/quotes', listQuotes);
router.post('/quotes', user.is('authenticated'), createQuote);
router.get('/quotes/:id', getQuote);
router.put('/quotes/:id', user.is('authenticated'), updateQuote);
router.delete('/quotes/:id', user.is('authenticated'), deleteQuote);

module.exports = router;

function listQuotes(req, res, next) {
  Quote.find()
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function getQuote(req, res, next) {
  Quote.findById(req.params.id)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function createQuote(req, res, next) {
  const data = dropProperties(req.body, immutables);
  Quote.create(data)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
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
