'use strict';

const HTTPStatus = require('http-status');
const router = require('express').Router();
const User = require('../models/user');
const dropProperties = require('lodash/omit');
const get = require('lodash/get');
const { user } = require('../auth/permissions');

//props to omit for this data model, safety measure
const immutables = ['role', 'facebookId'];
const defaultLimit = 50;

//guest routes
router.post('/guest/signup', createUser);

//logged user specific routes
router.get('/me/profile', user.is('auth'), getMyProfile);
router.put('/me/profile', user.is('auth'), updateMyProfile);
router.delete('/me/profile/', user.is('auth'), deleteMyProfile);
router.put('/me/profile/resetPassword', user.is('auth'), resetPassword);

//accessible with any role
router.get('/public/users', user.is('auth'), listPublicUsers);
router.get('/public/users/:id', user.is('auth'), getPublicUser);

//role based authorization
router.get('/users', user.is('auth'), user.is('admin'), listUsers);
router.get('/users/:id', user.is('admin'), getUser);
router.put('/users/:id', user.is('auth'), user.is('admin'), updateUser);
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
      const message = get(err, 'errors.password.message');
      if (message) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ error: message });
      }
      return next(err);
    });
}

// -----> Public routes, accessible with any role <------

function listPublicUsers(req, res, next) {
  const privateData = ['email', 'password'];
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  User.find()
    .skip(offset)
    .limit(limit)
    .omit(privateData)
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
  const update = dropProperties(req.body, [ ...immutables, 'password']);
  User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true })
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}

function deleteMyProfile(req, res, next) {
  User.findByIdAndRemove(req.user.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

function resetPassword(req, res, next) {
  User.findById(req.user.id)
    .then(user => {
      return user.updatePassword(req.body.oldPassword, req.body.password);
    })
    .then(() => res.status(HTTPStatus.NO_CONTENT).send())
    .error(err => res.status(HTTPStatus.BAD_REQUEST).send(err.message))
    .catch(err => {
      const message = get(err, 'errors.password.message');
      if (message) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ error: message });
      }
      next(err);
    });
}

// -----> Role based routes, admin <------

function listUsers(req, res, next) {
  const privateData = ['password'];
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  User.find()
    .skip(offset)
    .limit(limit)
    .omit(privateData)
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
  const update = dropProperties(req.body, privateData);
  User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).omit(privateData)
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

