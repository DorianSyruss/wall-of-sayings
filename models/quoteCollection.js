'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteCollection = new Schema({
  owner: Schema.ObjectId, //make owner_name attr, pull from the id of owner
  title: 'string',
  description: 'string',
  category: 'string',
  quotes: [Schema.ObjectId],
  collaborators: [Schema.ObjectId]
});

quoteCollection.methods.addQuote = function (quote_id) {
  return this.update({ $addToSet: { quotes: quote_id } });
};

quoteCollection.methods.addCollaborator = function (collaborator_id) {
  return this.update({ $addToSet: { collaborators: collaborator_id } });
};

module.exports = mongoose.model('QuoteCollection', quoteCollection);
