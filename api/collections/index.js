'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../../models/quoteCollection');
const dropProperties = require('lodash/omit');
const pickProperties = require('lodash/pick');
const get = require('lodash/get');
const { Types } = require('../../models/helpers');
const { user } = require('./permissions');
//props to omit for this data model, safety measure
const immutables = ['owner'];
const defaultLimit = 50;

router.post('/collections', user.is('auth'),  createQuoteCollection);

//role based authorization
router.get('/collections', user.is('auth'), user.is('admin'), listQuoteCollections);

router.get('/collections/:id',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('view'),
  getQuoteCollection
);

router.put('/collections/:id',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('edit'),
  updateQuoteCollection
);

router.put('/collections/:id/quotes/:action',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('edit'),
  updateQuotesInCollection
);

router.put('/collections/:id/collaborators/:action',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('edit'),
  updateCollaborators
);

router.delete('/collections/:id',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('delete'),
  deleteQuoteCollection
);

router.get('/collections/:id/collaborators',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('view'),
  listCollaborators
);

router.get('/collections/:id/quotes',
  user.is('auth'),
  setContext(QuoteCollection, 'getCollection'),
  user.can('view'),
  listCollectionQuotes
);

module.exports = router;

function setContext(model, name, path = 'params.id') {
  return function(req, res, next) {
    const id = get(req, path);
    req.ctx = {
      [name](options = {}) {
        const query = Object.assign({ _id: id }, options);
        return model.findOne(query);
      }
    };
    next();
  };
}

// -----> Routes <------

function listQuoteCollections(req, res, next) {
  const properties = ['owner', 'category', 'type'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;

  QuoteCollection.find(query)
    .skip(offset)
    .limit(limit)
    .then(collection => res.status(HTTPStatus.OK).send(collection))
    .catch(err => next(err));
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
    .then(quote => res.status(HTTPStatus.OK).send(quote))
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

function createQuoteCollection(req, res, next) {
  const collectionData = req.body;
  collectionData.owner = req.user.id;
  QuoteCollection.create(collectionData)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}



