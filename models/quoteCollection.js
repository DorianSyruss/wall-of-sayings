'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteCollection = new Schema({
  author: 'string',
  title: 'string',
  description: 'string',
  category: 'string'
});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
