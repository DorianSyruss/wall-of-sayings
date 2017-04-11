'use strict';

const router = require('express').Router();
const Quote = require('../models/quote');
const HTTPStatus = require('http-status');

router.get('/quotes', listQuotes);
router.get('/quotes/:id', getQuote);
router.post('/quotes', createQuote);
router.delete('/quotes/:id', deleteQuote);
router.put('/quotes/:id', updateQuote);

module.exports = router;

function listQuotes(req, res, next) {
  Quote.getAll()
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function getQuote(req, res, next) {
  Quote.getOne(req.params.id)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function createQuote(req, res, next){
  let { quote, author } = req.body;
  Quote.createOne(quote, author)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  Quote.deleteOne(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuote(req, res, next) {
  let update = { quote: req.body.quote, author: req.body.author };
  Quote.updateOne(req.params.id, update)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}
