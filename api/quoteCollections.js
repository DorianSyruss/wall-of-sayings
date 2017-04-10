'use strict';

const router = require('express').Router();
const util = require('../utils/quoteCollections');
const Quote = require('../models/quote.js');
const QuoteCollection = require('../models/quoteCollection.js');
const HTTPStatus = require('http-status');

router.get('/collections', listQuoteCollections);
router.get('/collections/filter', findByAttribute);
router.get('/collections/:id', getQuoteCollection);
router.post('/collections', createQuoteCollection);
router.delete('/collections/:id', deleteQuoteCollection);
router.put('/collections/:id', updateQuoteCollection);
router.post('/collections/:id/quotes/', addNewQuote);
router.get('/collections/:id/quotes/', listCollectionQuotes);

module.exports = router;

function listQuoteCollections(req, res, next) {
  QuoteCollection.find()
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function getQuoteCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function findByAttribute(req, res, next) {
  QuoteCollection.find({ category: req.query.category })
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function createQuoteCollection(req, res, next){
  let { author, title, description, category, quote_ids } = req.body;
  QuoteCollection.create({ author, title, description, category, quote_ids })
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next){
  QuoteCollection.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuoteCollection(req, res, next) {
  let update = { author: req.body.author, title: req.body.title,
  description: req.body.description, category: req.body.category };
  QuoteCollection.findOneAndUpdate(req.params.id, update, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function addNewQuote(req, res, next) {
  Quote.getOne(req.body.quote_id)
    .then(quote => {
      QuoteCollection.findById(req.params.id)
        .then(quoteCollection => quoteCollection.addQuote(quote._id))
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
        .catch(err => next(err));
  });
}

function listCollectionQuotes(req, res, next) {
  util.getQuotes(req.params.id)
    .then(quotes => {
      res.send(quotes);
    });
}


