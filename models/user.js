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
  facebookId: String,
  name: { type: String, required: true, minlength: 2 },
  surname: { type: String, required: true, minlength: 2 },
  gender: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      message: 'Password validation failed.',
      validator(password) {
        return helpers.passwordSchema.validate(password);
      }
    }
  },
  role: { type: Number, default: Role.User, validate: Role.isValid }
}, { timestamps: { createdAt: 'created_at' } });

User.pre('save', function (next) {
  if (!this.isModified('password')) next();

  helpers.hash(this.password)
    .then(hash => this.password = hash)
    .then(() => next())
    .catch(err => next(err));
});

Object.assign(User.query, helpers);

Object.assign(User.methods, {
  getFullName() {
    return `${this.name} ${this.surname}`;
  },

  updatePassword(oldPassword, password) {
    return this.validPassword(oldPassword, (err, valid) => {
      if (err || !valid){
        return new Error();
      }
      this.password = password;
      return this.save();
    });
  },

  validPassword(password, cb) {
    return bcrypt.compare(password, this.password, cb);
  }
});

Object.assign(User.statics, {
  get roles() {
    return Role;
  }
});

module.exports = mongoose.model('User', User);
