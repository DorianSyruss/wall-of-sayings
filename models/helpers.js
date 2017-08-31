'use strict';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 8;
const passwordValidator = require('password-validator');
const mongoose = require('mongoose');
const omitBy = require('lodash/omitBy');

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

module.exports = { omit, pick, hash, passwordSchema };

Object.assign(mongoose.Model, {
  getById(arrayOfIds, type) {
    const conditions = { _id: { $in: arrayOfIds }, type };
    return this.find(omitBy(conditions, prop => !prop));
  }
});
