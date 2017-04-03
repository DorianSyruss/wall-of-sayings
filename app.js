//require needed dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');
const app = express();
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/test', { config: { autoIndex: false }});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connection established');
});

/* Define schemas */

const quoteSchema = mongoose.Schema({
  quote: 'string',
  author: 'string',
  favoritedCount: 'Number'
});

const userSchema = mongoose.Schema({
  name: 'string',
  surname: 'string'
});

/* Define mock-up prototype schema methods */

quoteSchema.methods.getAuthor = function () {
  return this.author;
};

userSchema.method.getFullName = function () {
  return this.name + this.surname;
};

/* Define models according to schemas */

let Quote = mongoose.model('Quote', quoteSchema);
let User = mongoose.model('User', userSchema);


/* Add some data to db */

User({
  name: 'Pero',
  surname: 'Peric'
}).save();

Quote({
  quote: 'Whats up',
  author: 'Ivan S'
}).save();

/* Handlers */

/* Routes */
app.get('/quotes', (req, res, next) => {
  Quote.find()
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
});

app.get('/quotes/:id', (req, res, next) => {
  Quote.findById(req.params.id)
    .then(quote => res.status(HTTPStatus.OK).send(quote))
    .catch(err => next(err));
});

app.post('/quotes', (req, res, next) => {
  Quote.create({
    quote: req.body.quote,
    author: req.body.author
  })
  .then(quote => res.status(HTTPStatus.OK).send(quote))
  .catch(err => next(err));
});

app.delete('/quotes/:id', (req, res, next) => {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
});

app.delete('/quotes', (req, res, next) => {
  Quote.remove()
    .then(() => res.status(HTTPStatus.NO_CONTENT).end())
    .catch(err => next(err));
});

app.get('/users', (req, res) => {
  Quote.find()
    .then(user => res.status(HTTPStatus.OK).send(user))
    .catch(err => next(err));
});

app.use(express.static(__dirname + '/public'));

// create route for '/' and render the 'index.ejs' file to the browser
app.get('/', function (req, res) {
  res.render('index');
});

app.use((err, req, res) => {
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
});

let port = process.env.PORT || 8080;  //set port

//  tell the app to listen on specified port
app.listen(port);
console.log('Server running on port: ' + port);


