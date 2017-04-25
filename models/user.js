'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
  facebook_id: Number,
  name: String,
  surname: String,
  gender: String,
  email: String,
  password: String
});

Object.assign(user.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  },
  //just test, implement hash and compare
  validPassword(password) {
    return true;
  }
});

module.exports = mongoose.model('User', user);
