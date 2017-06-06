'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../models/quoteCollection');
const dropProperties = require('lodash/omit');

//props to omit for this data model, safety measure
const immutables = ['owner'];

router.get('/collections', listQuoteCollections);
router.post('/collections', createQuoteCollection);
router.get('/collections/:id', getQuoteCollection);
router.put('/collections/:id', updateQuoteCollection);
router.delete('/collections/:id', deleteQuoteCollection);
router.post('/collections/:id/collaborators', addNewCollaborators);
router.delete('/collections/:id/collaborators', removeCollaborators);
router.get('/collections/:id/quotes', listCollectionQuotes);
router.post('/collections/:id/quotes', addNewQuote);
router.delete('/collections/:id/quotes', deleteQuote);

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

function createQuoteCollection(req, res, next) {
  const data = dropProperties(req.body, immutables);
  QuoteCollection.create(data)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next) {
  QuoteCollection.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuoteCollection(req, res, next) {
  const data = dropProperties(req.body, immutables);
  QuoteCollection.findOneAndUpdate(req.params.id, data, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function addNewQuote(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then((quoteCollection) => quoteCollection.addQuote(req.body.quote_ids))
    .then((quoteCollection) => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function deleteQuote(req, res, next) {
  let quote_ids = req.body.quote_ids;
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.deleteQuotes(quote_ids))
    .then((status) => res.status(HTTPStatus.OK).send(status))
    .catch(err => next(err));
}

function addNewCollaborators(req, res, next) {
  let collaborator_ids = req.body.collaborator_ids;
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.addCollaborators(collaborator_ids))
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function removeCollaborators(req, res, next) {
  let collaborator_ids = req.body.collaborator_ids || [];
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.removeCollaborators(collaborator_ids))
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(collection => collection.getQuotes())
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}
