'use strict';

require('dotenv').config();
const { db } = require('../db');
const User = require('../models/user');

const users = [{
  email: 'mali@ante2.com',
  password: 'nekipass2'
}, {
  email: 'mali@ante3.com',
  password: 'nekipass2'
}];

console.log('Seeding...');
User.remove({})
  .then(() => User.create(users))
  .then(() => console.log('Finished...'))
  .catch(err => console.error(err.message))
  .then(() => db.close());
