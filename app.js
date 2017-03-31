//require needed dependencies
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const app = express();
mongoose.connect('mongodb://localhost/test', { config: { autoIndex: false }});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
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

quoteSchema.methods.getAuthor = function() {
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

/* Routes */
app.get('/quotes', (req, res) => {
  Quote.find(function (err, quote) {
    if (err) return res.send(err);
    res.send(quote);
  });
});

app.post('/quotes', (req, res) => {
  Quote({
    quote: req.body.quote,
    author: 'Ivan S'
  }).save()
    .then((data) => {
    res.send(data);
    });
});

app.get('/users', (req, res) => {
  User.find(function (err, user) {
    if (err) return res.send(err);
    res.send(user);
  });
});

app.use(express.static(__dirname + '/public'));

// create route for '/' and render the 'index.ejs' file to the browser
app.get('/', function (req, res) {
  res.render('index');
});

let port = process.env.PORT || 8080;  //set port

//  tell the app to listen on specified port
app.listen(port);
console.log('Server running on port: ' + port);


