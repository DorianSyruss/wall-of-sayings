'use strict';

require('dotenv').config();
const { db } = require('../db');
const User = require('../models/user');
const Quote = require('../models/quote');
const QuoteCollection = require('../models/quoteCollection');

// mock-up users
const users = [{
  name: 'ante1',
  username: 'antic1',
  gender: 'male',
  email: 'mali@ante1.com',
  password: 'jedan'
}, {
  name: 'ante2',
  username: 'antic2',
  gender: 'male',
  email: 'mali@ante2.com',
  password: 'dva'
}, {
  name: 'ante3',
  username: 'antic3',
  email: 'mali@ante3.com',
  password: 'tri'
}, {
  name: 'ante4',
  username: 'antic4',
  email: 'mali@ante4.com',
  password: 'cetiri'
}, {
  name: 'ante5',
  username: 'antic5',
  email: 'mali@ante5.com',
  password: 'pet'
}];

// mock-up quotes

const quotes = [{
  quote: 'was is das',
  author: users[0]
}, {
  quote: 'was is das',
  author: users[1]
}];

console.log('Seeding...');
User.remove({})
  .then(() => User.create(users))
  .then(() => console.log('Users created...'))
  .catch(err => console.error(err.message))
  .then(() => db.close());

Quote.remove({})
  .then(() => Quote.create(users))
  .then(() => console.log('Quotes created...'))
  .catch(err => console.error(err.message))
  .then(() => db.close());
