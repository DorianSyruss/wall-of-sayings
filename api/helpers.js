'use strict';

const get = require('lodash/get');

module.exports = { setContextOne, setContextMany };

function setContextOne(model, name, path = 'params.id') {
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

function setContextMany(model, name) {
  return function(req, res, next) {
    req.ctx = {
      [name](query = {}) {
        return model.findMany(query);
      }
    };
    next();
  };
}
