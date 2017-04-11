'use strict';

const router = require('express').Router();
const User = require('../models/user.js');
const HTTPStatus = require('http-status');

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

module.exports = router;

function listUsers(req, res){
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
  let { name, surname } = req.body;
  User.create({ name, surname })
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
