'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const quote = new Schema({
  quote: String,
  author: String,
  favoritedCount: Number
});

Object.assign(quote.methods, {
  getAuthor() {
    return this.author;
  },

  incrementCount(){
    this.favoritedCount++;
    return this.save();
  }
});

module.exports = mongoose.model('Quote', quote);