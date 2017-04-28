'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../models/quoteCollection');

router.get('/collections', listQuoteCollections);
router.post('/collections', createQuoteCollection);
router.get('/collections/:id', getQuoteCollection);
router.put('/collections/:id', updateQuoteCollection);
router.delete('/collections/:id', deleteQuoteCollection);
router.post('/collections/:id/collaborators', addNewCollaborator);
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
  QuoteCollection.findOneAndUpdate(req.params.id, req.body, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function addNewQuote(req, res, next) {
    QuoteCollection.findById(req.params.id)
      .then(quoteCollection => quoteCollection.addQuote(req.body.quote_id))
      .then(queryStatus => res.status(HTTPStatus.OK).send(queryStatus))
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
  let collaborator_ids = req.body.collaborator_ids || [];
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.addCollaborators(collaborator_ids))
    .then(queryStatus => res.status(HTTPStatus.OK).send(queryStatus))
    .catch(err => next(err));
}

function removeCollaborators(req, res, next){
  let collaborator_ids = req.body.collaborator_ids || [];
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => quoteCollection.removeCollaborators(collaborator_ids))
    .then(queryStatus => res.status(HTTPStatus.OK).send(queryStatus))
    .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(collection => collection.getQuotes())
    .then(quotes => { res.status(HTTPStatus.OK).send(quotes); })
    .catch(err => next(err));
}


