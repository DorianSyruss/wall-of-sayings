'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const quoteCollection = new Schema({
  owner: ObjectId,
  title: String,
  description: String,
  category: String,
  quotes: [ObjectId],
  collaborators: [ObjectId]
});

Object.assign(quoteCollection.methods, {

  addQuote(quoteId) {
    this.quotes.addToSet(...quoteId);
    return this.save();
  },

  deleteQuotes(quoteIds = []) {
    this.quotes.remove(...quoteIds);
    return this.save();
  },

  getQuotes() {
    const Quote = mongoose.model('Quote');
    return Promise.all(this.quotes.map(id => Quote.findById(id)));
  },

  addCollaborators(collaborator_ids = []) {
    this.collaborators.addToSet(...collaborator_ids);
    return this.save();
  },

  removeCollaborators(collaborators_ids) {
    this.collaborators.remove(...collaborators_ids);
    return this.save();
  }
});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
