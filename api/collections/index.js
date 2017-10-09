'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../../models/quoteCollection');
const dropProperties = require('lodash/omit');
const { Types } = require('../../models/helpers');
const { user } = require('./permissions');
const { setContextOne, setContextMany } = require('../helpers');
//props to omit for this data model, safety measure
const immutables = ['owner'];

router.post('/collections', user.is('auth'),  createQuoteCollection);

//role based authorization
router.get('/collections',
  user.is('auth'),
  setContextMany(QuoteCollection, 'getCollections'),
  user.can('listCollections'),
  listQuoteCollections
);

router.get('/collections/:id',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('viewCollection'),
  getQuoteCollection
);

router.put('/collections/:id',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('editCollection'),
  updateQuoteCollection
);

router.put('/collections/:id/quotes/:action',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('editCollection'),
  updateQuotesInCollection
);

router.put('/collections/:id/collaborators/:action',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('editCollection'),
  updateCollaborators
);

router.delete('/collections/:id',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('deleteCollection'),
  deleteQuoteCollection
);

router.get('/collections/:id/collaborators',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('viewCollection'),
  listCollaborators
);

router.get('/collections/:id/quotes',
  user.is('auth'),
  setContextOne(QuoteCollection, 'getCollection'),
  user.can('viewCollection'),
  listCollectionQuotes
);

module.exports = router;

// -----> Routes <------

function listQuoteCollections(req, res, next) {
  const collections = req.ctx.collections;
  res.status(HTTPStatus.OK).send(collections);
}

function getQuoteCollection(req, res, next) {
  const quoteCollection = req.ctx.collection;
  res.status(HTTPStatus.OK).send(quoteCollection);
}

function updateQuoteCollection(req, res, next) {
  const data = dropProperties(req.body, immutables);
  const quoteCollection = req.ctx.collection;

  quoteCollection.set(data);
  quoteCollection.save()
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function updateQuotesInCollection(req, res, next) {
  let quoteCollection = req.ctx.collection;
  const action = req.params.action;

  quoteCollection = quoteCollection.updateQuotes(req.body.quoteId, req.user.id, action);

  quoteCollection
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message))
    .catch(err => next(err));
}

function updateCollaborators(req, res, next) {
  let quoteCollection = req.ctx.collection;
  const collaboratorId = req.body.collaboratorId;
  const action = req.params.action;

  quoteCollection = quoteCollection.updateCollaborators(collaboratorId, action);

  quoteCollection
   .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
   .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message))
   .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next) {
  const quoteCollection = req.ctx.collection;

  quoteCollection.remove()
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  const quoteCollection = req.ctx.collection;
  const showAll = quoteCollection.isOwner(req.user) ||
    quoteCollection.isCollaborator(req.user);
  const filter = showAll ? {} : { type: Types.Public };

   quoteCollection.getQuotes(filter)
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}

function listCollaborators(req, res, next) {
  const quoteCollection = req.ctx.collection;

  if (!quoteCollection) res.status(HTTPStatus.NO_CONTENT).end();
  else return quoteCollection.getCollaborators()
    .then(quotes => res.status(HTTPStatus.OK).send(quotes))
    .catch(err => next(err));
}

//todo [optional]: make rule to specify who can create (user and admin or just user)
//do we want admin considered as user?
function createQuoteCollection(req, res, next) {
  const collectionData = req.body;
  collectionData.owner = req.user.id;
  QuoteCollection.create(collectionData)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}



