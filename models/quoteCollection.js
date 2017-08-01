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
}, { timestamps: { createdAt: 'created_at' } });

Object.assign(quoteCollection.methods, {

  addQuote(quoteId, userId) {
    return mongoose.model('Quote').findById(quoteId)
      .then(quote => {
        if (!quote) {
          return Promise.reject(new OperationalError('Quote not found'));
        }

        this.quotes.addToSet(quote.id);
        quote.trackUser(userId); //remember(track) the user that saved the quote
        return quote.countFavorites();
    })
      .then(() => this.save());
  },

  removeQuote(quoteId, userId) {
    return mongoose.model('Quote').findById(quoteId)
      .then(quote => {
        if (!quote) {
          return Promise.reject(new OperationalError('Quote does not exist'));
        }

        this.quotes.remove(quoteId);
        quote.untrackUser(userId);
        return quote.countFavorites();
      })
      .then(() => this.save());
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
  },

  getCollaborators() {
    const privateData = ['password'];
    const User = mongoose.model('User');
    return Promise.all(this.collaborators.map(id => User.findById(id).omit(privateData)));
  }
});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
