'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../models/quoteCollection');
const dropProperties = require('lodash/omit');
const pickProperties = require('lodash/pick');
const { user } = require('../auth/permissions');
const { Types } = require('../models/quote');
const { filter } = require('../models/helpers');
//props to omit for this data model, safety measure
const immutables = ['owner'];
const defaultLimit = 50;

//accessible with any role
router.get('/public/collections', user.is('auth'), listPublicCollections);
router.get('/public/collections/:id', user.is('auth'), getPublicCollection);
router.get('/public/collections/:id/quotes', user.is('auth'), listPublicCollectionQuotes);
router.get('/public/collections/:id/collaborators', user.is('auth'), listPublicCollectionCollaborators);

//logged user specific routes
router.post('/collections', user.is('auth'),  createQuoteCollection);
router.get('/me/collections', user.is('auth'), listMyCollections);
router.get('/me/collections/:id', user.is('auth'), getMyQuoteCollection);
router.put('/me/collections/:id', user.is('auth'), updateMyQuoteCollection);
router.delete('/me/collections/:id', user.is('auth'), deleteMyQuoteCollection);
router.post('/me/collections/:id/collaborators', user.is('auth'), addMyCollaborators);
router.delete('/me/collections/:id/collaborators', user.is('auth'), removeMyCollaborators);
router.get('/me/collections/:id/collaborators', user.is('auth'), listMyCollaborators);
router.post('/me/collections/:id/quotes', user.is('auth'), addQuoteToMyCollection);
router.delete('/me/collections/:id/quotes', user.is('auth'), removeQuoteFromMyCollection);
router.get('/me/collections/:id/quotes', user.is('auth'), listMyCollectionQuotes);

//role based authorization
router.get('/collections', user.is('auth'), user.is('admin'), listQuoteCollections);
router.get('/collections/:id', user.is('auth'), user.is('admin'), getQuoteCollection);
router.put('/collections/:id', user.is('auth'), user.is('admin'), updateQuoteCollection);
router.delete('/collections/:id', user.is('auth'), user.is('admin'), deleteQuoteCollection);
router.post('/collections/:id/collaborators', user.is('auth'), user.is('admin'), addCollaborators);
router.delete('/collections/:id/collaborators', user.is('auth'), user.is('admin'), removeCollaborators);
router.get('/collections/:id/collaborators', user.is('auth'), user.is('admin'), listCollaborators);
router.post('/collections/:id/quotes', user.is('auth'), user.is('admin'), addQuoteToCollection);
router.delete('/collections/:id/quotes', user.is('auth'), user.is('admin'), removeQuoteFromCollection);
router.get('/collections/:id/quotes', user.is('auth'), user.is('admin'), listCollectionQuotes);

module.exports = router;

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

function getPublicCollection(req, res, next) {
  const query = { type: Types.Public, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).send();
      }
      return res.status(HTTPStatus.OK).send(quoteCollection);
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

// -----> Logged user specific ('/me') routes <------

function createQuoteCollection(req, res, next) {
  const collectionData = req.body;
  collectionData.owner = req.user.id;
  QuoteCollection.create(collectionData)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

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

function getMyQuoteCollection(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(quoteCollection);
    })
    .catch(err => next(err));
}

function updateMyQuoteCollection(req, res, next) {
  const privateData = ['quotes', ...immutables];
  const update = dropProperties(req.body, privateData);
  const query = { owner: req.user.id, _id: req.params.id };
  const options = { new: true, runValidators: true };

  QuoteCollection.findOneAndUpdate(query, update, options)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteMyQuoteCollection(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOneAndRemove(query)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function addMyCollaborators(req, res, next) {
  const collaboratorIds = req.body.collaboratorIds;
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.addCollaborators(collaboratorIds)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection));
    })
    .catch(err => next(err));
}

function removeMyCollaborators(req, res, next) {
  const collaboratorIds = req.body.collaboratorIds || [];
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.removeCollaborators(collaboratorIds)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection));
    })
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

function addQuoteToMyCollection(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.addQuote(req.body.quoteId, req.user.id)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
        .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message));
      })
    .catch(err => next(err));
}

function removeQuoteFromMyCollection(req, res, next) {
  const query = { owner: req.user.id, _id: req.params.id };
  QuoteCollection.findOne(query)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.removeQuote(req.body.quoteId, req.user.id)
        .then(status => res.status(HTTPStatus.OK).send(status))
        .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message));
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

// -----> Role based routes, admin <------

function listQuoteCollections(req, res, next) {
  const properties = ['owner', 'category', 'type'];
  const query = pickProperties(req.query, properties);
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  QuoteCollection.find(query)
    .skip(offset)
    .limit(limit)
    .then(quoteCollections => res.status(HTTPStatus.OK).send(quoteCollections))
    .catch(err => next(err));
}

function getQuoteCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).send();
      }
      return res.status(HTTPStatus.OK).send(quoteCollection);
    })
    .catch(err => next(err));
}

function updateQuoteCollection(req, res, next) {
  const data = dropProperties(req.body, immutables);
  const options = { new: true, runValidators: true };
  QuoteCollection.findOneAndUpdate(req.params.id, data, options)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next) {
  QuoteCollection.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function addQuoteToCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.addQuote(req.body.quoteId, req.user.id)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
        .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message));
    })
    .catch(err => next(err));
}

function removeQuoteFromCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.removeQuote(req.body.quoteId, req.user.id)
        .then(status => res.status(HTTPStatus.OK).send(status))
        .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message));
    })
    .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.getQuotes()
        .then(quotes => res.status(HTTPStatus.OK).send(quotes));
    })
    .catch(err => next(err));
}

function addCollaborators(req, res, next) {
  const collaboratorIds = req.body.collaboratorIds;
  QuoteCollection.findOne(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.addCollaborators(collaboratorIds)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection));
    })
    .catch(err => next(err));
}

function removeCollaborators(req, res, next) {
  const collaboratorIds = req.body.collaboratorIds || [];
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.removeCollaborators(collaboratorIds)
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection));
    })
    .catch(err => next(err));
}

function listCollaborators(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => {
      if (!quoteCollection) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return quoteCollection.getCollaborators()
        .then(collaborators => res.status(HTTPStatus.OK).send(collaborators));
    })
    .catch(err => next(err));
}

