'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../../models/quoteCollection');
const pickProperties = require('lodash/pick');
const { user } = require('../../auth/permissions');
const { filter } = require('../../models/helpers');
const defaultLimit = 50;


router.get('/me/collections', user.is('auth'), listMyCollections);
router.get('/me/collections/:id/collaborators', user.is('auth'), listMyCollaborators);
router.get('/me/collections/:id/quotes', user.is('auth'), listMyCollectionQuotes);

function listMyCollections(req, res, next) {
  const properties = ['category', 'type'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  query.owner = req.user.id;
  let quoteCollection;

  if (req.query.collaborations === filter.true) {
    quoteCollection = QuoteCollection.findMany({ collaborators: req.user.id });
  } else {
    quoteCollection = QuoteCollection.find(query);
  }

  quoteCollection
    .skip(offset)
    .limit(limit)
    .then(quoteCollections => res.status(HTTPStatus.OK).send(quoteCollections))
    .catch(err => next(err));
}

function listMyCollaborators(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
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

function listMyCollectionQuotes(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.getQuotes()
        .then(quotes => res.status(HTTPStatus.OK).send(quotes));
    })
    .catch(err => next(err));
}
