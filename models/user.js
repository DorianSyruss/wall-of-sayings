'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const { Schema } = mongoose;

const Role = {
  Admin: 0,
  User: 1,

  isValid(val) {
    let role = parseInt(val, 10);
    if (isNaN(role)) return false;
    return Object.keys(Role).reduce((acc, key) => {
      let val = Role[key];
      return acc || val === role;
    }, false);
  }
};

const User = new Schema({
  facebook_id: Number,
  name: String,
  surname: String,
  gender: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: Number, default: Role.User, validate: Role.isValid }
}, { timestamps: { createdAt: 'created_at' } });

Object.assign(User.query, helpers);

Object.assign(User.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  },

  validPassword(password, cb) {
    bcrypt.compare(password, this.password, cb);
  }
});

Object.assign(User.statics, {
  get roles() {
    return Role;
  }
});

module.exports = mongoose.model('User', User);
