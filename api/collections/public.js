'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../../models/quoteCollection');
const pickProperties = require('lodash/pick');
const { user } = require('../../auth/permissions');
const { Types } = require('../../models/quote');
const defaultLimit = 50;

router.get('/public/collections', user.is('auth'), listPublicCollections);
router.get('/public/collections/:id/quotes', user.is('auth'), listPublicCollectionQuotes);
router.get('/public/collections/:id/collaborators', user.is('auth'), listPublicCollectionCollaborators);

// -----> Public routes, accessible with any role <------

function listPublicCollections(req, res, next) {
  const properties = ['owner', 'category'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  query.type = Types.Public;
  QuoteCollection.find(query)
    .skip(offset)
    .limit(limit)
    .then(quoteCollections => {
      if (!quoteCollections.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quoteCollections);
    })
    .catch(err => next(err));
}

function listPublicCollectionQuotes(req, res, next) {
  const query = { type: Types.Public, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.getQuotes({ type: Types.Public })
        .then(quotes => res.status(HTTPStatus.OK).send(quotes));
    })
    .catch(err => next(err));
}

function listPublicCollectionCollaborators(req, res, next) {
  const query = { type: Types.Public, _id: req.params.id };
  QuoteCollection.findById(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.getCollaborators()
        .then(collaborators => res.status(HTTPStatus.OK).send(collaborators));
    })
    .catch(err => next(err));
}
