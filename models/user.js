'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
  name: 'string',
  surname: 'string'
});

user.methods.getFullName = function () {
  return this.name + this.surname;
};

module.exports = mongoose.model('User', user);
