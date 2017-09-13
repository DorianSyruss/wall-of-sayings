'use strict';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 8;
const passwordValidator = require('password-validator');
const mongoose = require('mongoose');
const omitBy = require('lodash/omitBy');
const mapValues = require('lodash/mapValues');

function pick(props = []) {
  const include = props.map(prop => `${prop}`).join(' ');
  return this.select(include);
}

function omit(props = []) {
  const discard = props.map(prop => `-${prop}`).join(' ');
  return this.select(discard);
}

function hash(password) {
  return bcrypt.hash(password, SALT_WORK_FACTOR);
}

const Types = {
  Private: 'private',
  Public: 'public',
  Voting: 'voting'
};

const filter = {
  true: 'true',
  false: 'false'
};

const actions = {
  Add: 'add',
  Remove: 'remove'
};

//password validation
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)  // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(['Password', 'password', 'password123']); // Blacklist these values

module.exports = { omit, pick, hash, passwordSchema, Types, filter, actions };

Object.assign(mongoose.Model, {
  findMany(query = {}) {
    let filter = mapValues(query, val => Array.isArray(val) ? { $in: val } : val);
    filter = omitBy(filter, val => val === '*');

    return this.find(filter);
  }
});
