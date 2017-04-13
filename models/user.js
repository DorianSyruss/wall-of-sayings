'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
  facebook_id: String,
  name: String,
  surname: String,
  email: String
});

Object.assign(user.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  }
});

module.exports = mongoose.model('User', user);
