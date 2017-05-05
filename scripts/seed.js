'use strict';

require('dotenv').config();
const { db } = require('../db');
const User = require('../models/user');
const Quote = require('../models/quote');
const QuoteCollection = require('../models/quoteCollection');
const min = 1;
const max = 6;

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
let quotes = [{
  quote: 'was is das1'
}, {
  quote: 'was is das2'
}, {
  quote: 'was is das3'
}, {
  quote: 'was is das4'
}, {
  quote: 'was is das5'
}];
quotes = quotes.map((quote, i) => quote.author = users[i].name);

//mock-up collections
const quoteCollections = [{
  owner: '',
  title: 'collection1',
  description: 'great collection 1',
  category: 'science'
}, {
  owner: '',
  title: 'collection2',
  description: 'great collection 2',
  category: 'life'
}, {
  owner: '',
  title: 'collection3',
  description: 'great collection 3',
  category: 'philosophy'
}, {
  owner: '',
  title: 'collection4',
  description: 'great collection 4',
  category: 'cultural'
}, {
  owner: '',
  title: 'collection5',
  description: 'great collection 5',
  category: 'inspiring'
}];

function seedUsers(users) {
  console.log('Seeding users...');
  return User.remove({})
    .then(() => User.create(users))
    .then(() => console.log('Users created...'));
}

function seedQuotes(quotes) {
  console.log('Seeding quotes...');
  return Quote.remove({})
    .then(() => Quote.create(quotes))
    .then(() => console.log('Quotes created...'));
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function add(quotes, item) {
  if (!quotes) quotes = [];
  quotes.push(item);
  return quotes;
}

function times(count, cb) {
  let i = 0;
  while (i < count) {
    cb(i);
    i += 1;
  }
}

function seedCollections() {
  console.log('Seeding collections..');
  return QuoteCollection.remove()
    .then(() => User.find()) //get users
    .then((users) => {
      for (let i = 0; i < users.length; i++) {
        quoteCollections[i].owner = users[i]._id; //set collection owner
        quoteCollections[i].collaborators = [(i + 1) < users.length ? users[i]._id : users[0]._id]; // set collection collaborator
      }
    })
    .then(() => Quote.find()) //get quotes
    .then((quotes) => {
      for (let i=0; i < quotes.length; i++) {
        let collection = quoteCollections[i];
        for (let j=0; j < random(min, max); j++) {
          let quote = quotes[j]._id;
          collection.quotes = add(collection.quotes, quote);
        }
      }
    })
    .then(() => QuoteCollection.create(quoteCollections))
    .then(() => console.log('Collections created'));
}

seedUsers(users)
  .then(() => seedQuotes(quotes))
  .then(() => console.log('Seeding done'))
  .then(() => seedCollections())
  .then(() => db.close())
  .catch(err => console.error(err.message));
