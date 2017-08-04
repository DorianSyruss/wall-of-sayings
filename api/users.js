'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const User = require('../models/user');
const dropProperties = require('lodash/omit');
const { user } = require('../auth/permissions');
const { hash } = require('../models/helpers');

//props to omit for this data model, safety measure
const immutables = ['role', 'facebookId'];

//guest routes
router.post('/guest/signup', hashPassword, createUser);

//logged user specific routes
router.get('/me/profile', user.is('auth'), getMyProfile);
router.put('/me/profile', user.is('auth'), hashPassword, updateMyProfile);
router.delete('/me/profile/', user.is('auth'), deleteMyProfile);

//accessible with any role
router.get('/public/users', user.is('auth'), listPublicUsers);
router.get('/public/users/:id', user.is('auth'), getPublicUser);

//role based authorization
router.get('/users', user.is('auth'), user.is('admin'), listUsers);
router.get('/users/:id', user.is('admin'), getUser);
router.put('/users/:id', user.is('auth'), user.is('admin'), hashPassword, updateUser);
router.delete('/users/:id', user.is('auth'), user.is('admin'), deleteUser);

module.exports = router;

// -----> Guest routes, no login needed <------

function createUser(req, res, next) {
  const data = dropProperties(req.body, immutables);
  User.create(data)
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => {
      if (err.code === 11000) {
        return res.status(HTTPStatus.CONFLICT).json('User already exists');
      }
      return next(err);
    });
}

// -----> Public routes, accessible with any role <------

function listPublicUsers(req, res, next) {
  const privateData = ['email', 'password'];
  User.find().omit(privateData)
    .then(users => {
      if (!users.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(users);
    })
    .catch(err => next(err));
}

function getPublicUser(req, res, next) {
  const privateData = ['email', 'password'];
  User.findById(req.params.id).omit(privateData)
    .then(user => {
      if (!user) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(user);
    })
    .catch(err => next(err));
}

// -----> Logged user specific ('/me') routes <------

function getMyProfile(req, res, next) {
  User.findById({ _id: req.user.id })
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function updateMyProfile(req, res, next) {
  const update = dropProperties(req.body, immutables);
  User.findByIdAndUpdate(req.user.id, update, { new: true })
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function deleteMyProfile(req, res, next) {
  User.findByIdAndRemove(req.user.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

// -----> Role based routes, admin <------

function listUsers(req, res, next) {
  const privateData = ['password'];
  User.find().omit(privateData)
    .then(users => {
      if (!users.length) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(users);
    })
    .catch(err => next(err));
}

function getUser(req, res, next) {
  const privateData = ['password'];
  User.findById(req.params.id).omit(privateData)
    .then(user => {
      if (!user) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(user);
    })
    .catch(err => next(err));
}

function updateUser(req, res, next) {
  const privateData = ['password'];
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).omit(privateData)
    .then(user => {
      if (!user) {
        return res.status(HTTPStatus.NO_CONTENT).end();
      }
      return res.status(HTTPStatus.OK).send(user);
    })
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

// -----> Helper middleware for password hashing <------

function hashPassword(req, res, next) {
  const password = req.body.password;
  if (!password) {
    return next();
  }

  hash(password).then(hash => {
    req.body.password = hash;
    next();
  });
}
