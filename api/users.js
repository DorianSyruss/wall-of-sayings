'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const User = require('../models/user');
const { isAdmin } = require('../auth/permissions');

router.get('/users', isAdmin, listUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

function listUsers(req, res, next){
  console.log('lala');
  User.find()
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function createUser(req, res, next) {
  User.create(req.body)
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function updateUser(req, res, next) {
  let update = { name: req.body.name, surname: req.body.surname };
  User.findOneAndUpdate(req.params.id, update, { new: true })
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}
