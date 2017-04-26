'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const SALT_WORK_FACTOR = 8;

const user = new Schema({
  facebook_id: Number,
  name: String,
  surname: String,
  gender: String,
  email: String,
  password: String
});

user.pre('save', function (next) {
  if (!this.isModified('password')) next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

Object.assign(user.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  },

  validPassword(password, cb) {
    bcrypt.compare(password, this.password, cb);
  }
});

module.exports = mongoose.model('User', user);
