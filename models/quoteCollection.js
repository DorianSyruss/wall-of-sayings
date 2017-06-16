'use strict';

const mongoose = require('mongoose');
const { OperationalError } = require('bluebird');
const { Schema } = mongoose;
const { ObjectId } = Schema;


const quoteCollection = new Schema({
  owner: ObjectId,
  title: String,
  description: String,
  category: String,
  type: String,
  quotes: [ObjectId],
  collaborators: [ObjectId]
});

Object.assign(quoteCollection.methods, {

  addQuote(quoteId) {
    return mongoose.model('Quote').findById(quoteId)
      .then(quote => {
        if (!quote) {
          return Promise.reject(new OperationalError('Quote not found'));
        }

        this.quotes.addToSet(quote.id);
        return quote.incrementCount();
    })
      .then(() => this.save());
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
