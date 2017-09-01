'use strict';

const mongoose = require('mongoose');
const { OperationalError } = require('bluebird');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const { Types } = require('../models/quote');
const toArray = require('lodash/toArray');

const quoteCollection = new Schema({
  owner: ObjectId,
  title: {
    type: String,
    required: true,
    maxlength: 140
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: String,
  type: {
    type: String,
    required: true,
    enum: toArray(Types),
    default: Types.Private
  },
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

        this.quotes.remove(quoteId);
        quote.untrackUser(userId);
        return quote.countFavorites();
      })
      .then(() => this.save());
  },

  getQuotes(filter) {
    const Quote = mongoose.model('Quote');
    const query = Object.assign({}, filter);
    query._id = this.quotes;

    return Quote.findMany(query);
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
    return User.findMany({ _id: this.collaborators }).omit(privateData);
  }

});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
