'use strict';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 8;

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

function compare(newPassword, oldPassword) {
  return bcrypt.compare(newPassword, oldPassword);
}

module.exports = { omit, pick, hash, compare };
