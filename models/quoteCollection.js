'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const quoteCollection = new Schema({
  owner: ObjectId, //make owner_name attr, pull from the id of owner
  title: String,
  description: String,
  category: String,
  quotes: [ObjectId],
  collaborators: [ObjectId]
});

Object.assign(quoteCollection.methods, {
  addQuote(quoteId) {
    return this.update({ $addToSet: { quotes: quoteId } });
  },

  deleteQuotes(quoteIds) {
    this.quotes.remove(...quoteIds);
    return this.save();
  },

  deleteQuote(quoteId) {
    console.log(quoteId);
    return this.deleteQuotes(quoteId);
  },

  getQuotes() {
    const Quote = mongoose.model('Quote');
    return Promise.all(this.quote_id.map(id => Quote.findById(id)));
  },

  addCollaborator(collaborator_id) {
    return this.update({ $addToSet: { collaborators: collaborator_id } });
  }
});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
