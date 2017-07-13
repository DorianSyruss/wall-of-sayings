'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const quote = new Schema({
  quote: String,
  author: String,
  type: String,
  owner: ObjectId,
  favoritedCount: Number,
  favoritedBy: [ObjectId],
  publishedOn: Date
});

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
  }
});

module.exports = mongoose.model('Quote', quote);
