'use strict';

require('dotenv').config();
const { hash } = require('../models/helpers');
const random = require('lodash/random');
const times = require('lodash/times');
const uniqBy = require('lodash/uniqBy');

// models
const User = require('../models/user');
const Quote = require('../models/quote');
const QuoteCollection = require('../models/quoteCollection');

// seed data
const users = require('../seed/users.json');
const quotes = require('../seed/quotes.json');
const collections = require('../seed/quoteCollections.json');

const { db } = require('../db');

Promise.all([
  seed(User, 'User', users),
  seed(Quote, 'Quote', quotes)
])
.then(([ users, quotes ]) => seedCollections(users, quotes))
.then(() => db.close())
.catch(err => console.log(err, err.stack));

function seedCollections(users, quotes) {
  console.log('Seeding collections..');
  return QuoteCollection.remove()
    .then(() => {
      collections.forEach(collection => {
        addUsers(collection, users);
        addQuotes(collection, quotes);
      });
      return QuoteCollection.create(collections);
    })
    .then(() => console.log('Collections created'));
}

const randomFrom = coll => coll[random(coll.length - 1)];
const unique = coll => uniqBy(coll, '_id');

function addUsers(collection, users, collaboratorCount=3) {
  collection.owner = randomFrom(users)._id;
  let collaborators = times(collaboratorCount, () => randomFrom(users))
    .filter(user => user._id !== collection.owner);

  collection.collaborators = unique(collaborators);
}

function addQuotes(collection, quotes, quoteCount=4) {
  collection.quotes = collection.quotes || [];
  let selectedQuotes = times(quoteCount, () => randomFrom(quotes));
  collection.quotes.push(...unique(selectedQuotes));
}

function hashPasswordProp(user) {
  return hash(user.password).then(hashed => {
    user.password = hashed;
    return user;
  });
}

function* hashUsersPasswords(users) {
  yield* users.map(user => (user.password ? hashPasswordProp(user) : Promise.resolve(user)));
}

function isUserArray(arr) {
  return arr.some(item => item.password);
}

function seed(Model, name, data) {
  console.log(`Seeding ${name.toLowerCase()}s...`);
  return Model.remove(data)
    .then(() => (isUserArray(data) ? Promise.all(hashUsersPasswords(data)) : Promise.resolve(data)))
    .then(data => Model.create(data))
    .then(models => {
      console.log(`${name}s created...`);
      return models;
    })
    .then(models => {
      console.log(`${name}s created...`);
      return models;
    });
}
