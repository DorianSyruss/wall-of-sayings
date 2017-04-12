'use strict';

const QuoteCollection = require('../models/quoteCollection.js');
const router = require('express').Router();
const HTTPStatus = require('http-status');

router.get('/collections', listQuoteCollections);
router.post('/collections', createQuoteCollection);
router.get('/collections/:id', getQuoteCollection);
router.put('/collections/:id', updateQuoteCollection);
router.delete('/collections/:id', deleteQuoteCollection);
router.post('/collections/:id/', addNewCollaborator);
router.get('/collections/:id/quotes', listCollectionQuotes);
router.post('/collections/:id/quotes', addNewQuote);
router.delete('/collections/:id/quotes', deleteQuote);
//router.delete('/collections/:id/', removeCollaborator);

module.exports = router;

function listQuoteCollections(req, res, next) {
  QuoteCollection.find(req.query)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function getQuoteCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function createQuoteCollection(req, res, next){
  let collection = Object.assign({}, req.body, { owner: req.query.owner });
  QuoteCollection.create(collection)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next){
  QuoteCollection.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuoteCollection(req, res, next) {
  let update = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category
  };

  QuoteCollection.findOneAndUpdate(req.params.id, update, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function addNewQuote(req, res, next) {
    QuoteCollection.findById(req.params.id)
      .then(quoteCollection => quoteCollection.addQuote(req.body.quote_id))
      .then(status => res.status(HTTPStatus.OK).send(status))
      .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  let quote_ids = req.body.quote_ids || [];
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.deleteQuote(quote_ids))
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function addNewCollaborator(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.addCollaborator(req.query.collaborator))
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(collection => collection.getQuotes())
    .then(quotes => { res.status(HTTPStatus.OK).send(quotes); })
    .catch(err => next(err));
}


