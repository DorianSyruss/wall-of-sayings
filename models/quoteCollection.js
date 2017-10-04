'use strict';

const mongoose = require('mongoose');
const { OperationalError } = require('bluebird');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const { Types } = require('../models/quote');
const { actions } = require('../models/helpers');
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

  updateQuotes(quoteId, userId, action) {
    return mongoose.model('Quote').findById(quoteId)
      .then(quote => {
        if (!quote) {
          return Promise.reject(new OperationalError('Quote not found'));
        }
        else if (action === actions.Add) {
          this.quotes.addToSet(quote.id);
          quote.trackUser(userId); //remember(track) the user that saved the quote
        }
        else if (action === actions.Remove) {
          this.quotes.remove(quote.id);
          quote.untrackUser(userId);
        }
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

  updateCollaborators(collaboratorId, action) {
    return mongoose.model('User').findById(collaboratorId)
      .then(user => {
        if (!user) {
          return Promise.reject(new OperationalError('User not found'));
        }
        else if (action === actions.Add) this.collaborators.addToSet(user.id);
        else if (action === actions.Remove) this.collaborators.remove(user.id);
      })
      .then(() => this.save());
  },

  removeCollaborators(collaborators_ids = []) {
    this.collaborators.remove(...collaborators_ids);
    return this.save();
  },

  getCollaborators() {
    const privateData = ['password'];
    const User = mongoose.model('User');
    return User.findMany({ _id: this.collaborators }).omit(privateData);
  },

  isOwner(user) {
    return this.owner === user.id;
  },

  isCollaborator(user) {
    return this.collaborators.includes(user.id);
  }

});

module.exports = mongoose.model('QuoteCollection', quoteCollection);
