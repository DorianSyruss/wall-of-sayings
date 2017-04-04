'use-strict';

const router = require('express').Router();
const User = require('./../models/User.js');
const HTTPStatus = require('http-status');

router.get('/users', listUsers);

module.exports = router;

function listUsers(req, res){
  User.find()
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
}
