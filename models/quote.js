'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const quote = new Schema({
  quote: { type: String, required: true },
  author: { type: String, required: true },
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

  trackPublishing(type) {
    if (type !== 'public') return;
    this.publishedAt = new Date;
  }
});

module.exports = mongoose.model('Quote', quote);
