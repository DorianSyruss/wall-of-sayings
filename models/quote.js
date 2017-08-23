'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const { omit } = require('../models/helpers');

const quote = new Schema({
  quote: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500
  },
  author: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['private', 'public', 'voting'],
    default: 'private'
  },
  owner: ObjectId,
  tags: [String],
  favoritedCount: Number,
  favoritedBy: [ObjectId],
  publishedAt: Date
}, { timestamps: { createdAt: 'created_at' } });

const Type = {
  Private: 'private',
  Public: 'public',
  Voting: 'voting'
};

Object.assign(quote.methods, {
  getAuthor() {
    return this.author;
  },

  trackUser(userId) {
    this.favoritedBy.addToSet(userId);
    return this.save();
  },

  untrackUser(userId) {
    this.favoritedBy.remove(userId);
    return this.save();
  },

  countFavorites() {
    return this.favoritedCount = this.favoritedBy.length;
  },

  publish() {
    if (this.owner) omit([this.owner]);
    this.publishedAt = new Date;
  }
});

Object.assign(quote.statics, {
  get types() {
    return Type;
  }
});

module.exports = mongoose.model('Quote', quote);
