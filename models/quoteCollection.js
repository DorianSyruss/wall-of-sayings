'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteCollection = new Schema({
  author: 'string',
  title: 'string',
  description: 'string',
  category: 'string',
  quote_ids: [Schema.ObjectId]
});

quoteCollection.methods.addQuote = function (quote_id) {
  // this.quote_ids.push(quote_id);
  // return this.save();

  return this.update({ $addToSet: { quote_ids: quote_id } });
};

module.exports = mongoose.model('QuoteCollection', quoteCollection);
