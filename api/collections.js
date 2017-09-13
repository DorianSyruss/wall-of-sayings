'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const QuoteCollection = require('../models/quoteCollection');
const dropProperties = require('lodash/omit');
const pickProperties = require('lodash/pick');
const get = require('lodash/get');
const { user } = require('../auth/permissions');
const { Types } = require('../models/quote');
const { filter } = require('../models/helpers');
const Roles = require('../models/user').roles;
//props to omit for this data model, safety measure
const immutables = ['owner'];
const defaultLimit = 50;

//accessible with any role
router.get('/public/collections', user.is('auth'), listPublicCollections);
router.get('/public/collections/:id/quotes', user.is('auth'), listPublicCollectionQuotes);
router.get('/public/collections/:id/collaborators', user.is('auth'), listPublicCollectionCollaborators);

// logged user specific routes

router.post('/collections', user.is('auth'),  createQuoteCollection);
router.get('/me/collections', user.is('auth'), listMyCollections);
router.get('/me/collections/:id/collaborators', user.is('auth'), listMyCollaborators);
router.get('/me/collections/:id/quotes', user.is('auth'), listMyCollectionQuotes);

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

router.get('/collections/:id/collaborators', user.is('auth'), listCollaborators);
router.get('/collections/:id/quotes', user.is('auth'), listCollectionQuotes);

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

// -----> Possible permissions <------

user.use('view', (req, res) => {
  //public quotes can be seen by any logged in user,
  //collaborators and owner covers private collections

  let query = { $or: [{
    collaborators: { $in: [req.user.id] }
  }, {
    owner: req.user.id
  }, {
    type: Types.Public
  }] };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

user.use('edit', (req, res) => {
  let query = { $or: [{
    collaborators: { $in: [req.user.id] }
  }, {
    owner: req.user.id
  }] };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

user.use('delete', (req, res) => {
  let query = {
    owner: req.user.id
  };

  if (req.user.role === Roles.Admin) query = {};
  return req.ctx.getCollection(query)
    .then(coll => {
      if (!coll) return false;
      req.ctx.collection = coll;
      return true;
    });
});

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



