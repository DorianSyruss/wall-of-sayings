'use strict';

const router = require('express').Router();
const QuoteCollection = require('./../models/quoteCollection');
const HTTPStatus = require('http-status');

router.get('/collections/', listCollections);

function listCollections() {
  QuoteCollection.find()
    .then(quoteCollection => res.status(HTTPStatus.OK).send(quoteCollection))
    .catch(err => next(err));
}

module.exports = router;



