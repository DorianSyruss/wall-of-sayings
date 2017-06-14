'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const User = require('../models/user');
const dropProperties = require('lodash/omit');
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['role'];

router.get('/users', user.is('auth'), listUsers);
router.post('/signup', createUser);
router.get('/users/:id', user.is('auth'), getUser);
router.put('/users/:id', user.is('owner or admin'), updateUser);
router.delete('/users/:id', user.is('owner or admin'), deleteUser);

module.exports = router;

function listUsers(req, res, next){
  User.find()
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function createUser(req, res, next) {
  const data = dropProperties(req.body, immutables);
  User.create(data)
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateUser(req, res, next) {
  const data = dropProperties(req.body, immutables);
  User.findOneAndUpdate(req.params.id, data, { new: true })
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}
