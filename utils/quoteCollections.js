const Quote = require('../models/quote.js');
const QuoteCollection = require('../models/quoteCollection');

function* fetchQuotes(quote_ids) {
  for(let id of quote_ids) {
    yield Quote.getOne(id);
  }
}

function getQuotes(collection_id) {
  return QuoteCollection.findById(collection_id)
    .then(QuoteCollection => QuoteCollection.quote_ids)
    .then(quote_ids => {
      return Promise.all(fetchQuotes(quote_ids));
    });
}

module.exports = { getQuotes };
