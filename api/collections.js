'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../models/quoteCollection');
const dropProperties = require('lodash/omit');
const Roles = require('../models/user').roles;
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['owner'];

router.get('/me/collections', user.is('auth'), listMyCollections);
router.get('/collections', user.is('auth'), listQuoteCollections);
router.post('/collections', user.is('owner or admin'),  createQuoteCollection);
router.get('/collections/:id', user.is('owner or admin'), getQuoteCollection);
router.put('/collections/:id', user.is('owner or admin'), updateQuoteCollection);
router.delete('/collections/:id', user.is('owner or admin'), deleteQuoteCollection);
router.post('/collections/:id/collaborators', user.is('owner or admin'), addNewCollaborators);
router.delete('/collections/:id/collaborators', user.is('owner or admin'), removeCollaborators);
router.get('/collections/:id/quotes', user.is('owner or admin'), listCollectionQuotes);
router.post('/collections/:id/quotes', user.is('owner or admin'), addQuote);
router.delete('/collections/:id/quotes', user.is('owner or admin'), deleteQuote);

module.exports = router;

function listQuoteCollections(req, res, next) {
  let isAdmin = (req.user.role === Roles.Admin);
  let query;

  if (isAdmin) {
    query = QuoteCollection.find();
  } else {
    query = QuoteCollection.find({ type: 'public' });
  }

  query
    .then(quoteCollections => res.status(HTTPStatus.OK).send(quoteCollections))
    .catch(err => next(err));
}

function listMyCollections(req, res, next) {
  QuoteCollection.find({ owner: req.user.id })
    .then((quoteCollections) => res.status(HTTPStatus.OK).send(quoteCollections))
    .catch((err) => next(err));
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

function addQuote(req, res, next) {
    QuoteCollection.findById(req.params.id)
      .then(quoteCollection => quoteCollection.addQuote(req.body.quote_id))
      .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
      .error(e => res.status(HTTPStatus.BAD_REQUEST).send(e.message))
      .catch((err) => next(err));
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
