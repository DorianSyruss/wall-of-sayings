//require needed dependencies
const express = require('express');
const stylus = require('stylus');
const nib = require('nib');
const app = express();
const bodyParser = require('body-parser');

// set view engine to ejs
app.set('view engine', 'ejs');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

// tell node to compile .styl files to normal css files
app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}));

app.use(express.static(__dirname + '/public'));

// create route for '/' and render the 'index.ejs' file to the browser
app.get('/', function (req, res) {
  res.render('index');
});

let port = process.env.PORT || 8080;  //set port

//  tell the app to listen on specified port
app.listen(port);
console.log('Server running on port: ' + port);


