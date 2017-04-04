const mongoose = require('mongoose');
const { Schema } = mongoose;

const quote = new Schema({
  quote: 'string',
  author: 'string',
  favoritedCount: 'Number'
});

quote.methods.getAuthor = function () {
  return this.author;
};

module.exports = mongoose.model('Quote', quote);
