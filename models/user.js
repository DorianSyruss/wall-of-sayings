'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
  name: String,
  surname: String
});

Object.assign(user.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  }
});

module.exports = mongoose.model('User', user);
