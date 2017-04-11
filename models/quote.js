'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const quote = new Schema({
  quote: 'string',
  author: 'string',
  favoritedCount: 'Number'
});

// applied on document (instance of model)
quote.methods.getAuthor = function () {
  return this.author;
};

// applied on model

quote.statics.getAll = function() {
  return this.find();
};

quote.statics.getOne = function(id) {
  return this.findById(id);
};

quote.statics.createOne = function(quote, author) {
  return this.create({ quote, author });
};

quote.statics.deleteOne = function(id) {
  return this.findByIdAndRemove(id);
};

quote.statics.updateOne = function(id, update) {
  return this.findOneAndUpdate(id, update, { new:true });
};

module.exports = mongoose.model('Quote', quote);

