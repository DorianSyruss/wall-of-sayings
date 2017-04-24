'use strict';

const Quote = require('../models/quote');
const router = require('express').Router();
const HTTPStatus = require('http-status');

router.get('/quotes', listQuotes);
router.post('/quotes', createQuote);
router.get('/quotes/:id', getQuote);
router.put('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

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

function createQuote(req, res, next){
  let { quote, author } = req.body;
  Quote.create({ quote, author })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuote(req, res, next) {
  let update = { quote: req.body.quote, author: req.body.author };
  Quote.findOneAndUpdate(req.params.id, update, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}
