'use strict';

const router = require('express').Router();
const util = require('../utils/quoteCollections.js');
const Quote = require('../models/quote.js');
const QuoteCollection = require('../models/quoteCollection.js');
const HTTPStatus = require('http-status');

router.get('/collections', listQuoteCollections);
router.get('/collections/filter', findByAttribute); //on the same route /collections that supports filtering
router.get('/collections/:id', getQuoteCollection);
router.post('/collections', createQuoteCollection);
router.delete('/collections/:id', deleteQuoteCollection);
router.put('/collections/:id', updateQuoteCollection);
router.get('/collections/:id/quotes', listCollectionQuotes);
router.post('/collections/:id/quotes', addNewQuote);
router.post('/collections/:id/', addNewCollaborator);
//router.delete('/collections/:id/', removeCollaborator);

module.exports = router;

function listQuoteCollections(req, res, next) {
  let owner_id = req.query.owner;

  QuoteCollection.find({ owner_id })
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function getQuoteCollection(req, res, next) {
  QuoteCollection.findById(req.params.id)
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function findByAttribute(req, res, next) {
  QuoteCollection.find({ category: req.query.category })
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function createQuoteCollection(req, res, next){
  let owner = req.query.owner;
  let { title, description, category } = req.body;
  QuoteCollection.create({ owner, title, description, category })
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

function deleteQuoteCollection(req, res, next){
  QuoteCollection.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateQuoteCollection(req, res, next) {
  let update = { title: req.body.title,
  description: req.body.description, category: req.body.category };
  QuoteCollection.findOneAndUpdate(req.params.id, update, { new: true })
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
}

function addNewQuote(req, res, next) {
  Quote.getOne(req.body.quote_id)
    .then(quote => {
      QuoteCollection.findById(req.params.id)
        .then(quoteCollection => quoteCollection.addQuote(quote._id))
        .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
        .catch(err => next(err));
  });
}

function addNewCollaborator(req, res, next) {
    QuoteCollection.findById(req.params.id)
      .then(quoteCollection => quoteCollection.addCollaborator(req.query.collaborator))
      .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
      .catch(err => next(err));
}

function listCollectionQuotes(req, res, next) {
  util.getQuotes(req.params.id)
    .then(quotes => { res.status(HTTPStatus.OK).send(quotes); })
    .catch(err => next(err));
}
