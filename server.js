/*
* Project: Lucky Lows
* Module: main server
* Target: all
* Comment: 1 minute timer for timing engin is defined here
-----------------------------------------------*/
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// session middleware
var session = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override');
var dataCtrl = require('./controllers/index');
// load the env vars
require('dotenv').config();

// create the Express app
var app = express();

// connect to the MongoDB with mongoose
require('./config/database');
// configure Passport
require('./config/passport');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// mount the session middleware
app.use(session({
  secret: 'SEI Rocks!',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// mount all routes with appropriate base paths
app.use('/', require('./routes/index') );
app.use('/dashboard', require('./routes/index') );
app.use('/mystudio', require('./routes/mystudio') );
app.use('/settings', require('./routes/settings') );
app.use('/myrounds', require('./routes/myrounds') );
// app.use('/rooms', require('./routes/rooms') );

// invalid request, send 404 page
app.use(function(req, res) {
  res.status(404).send('Cant find that!');
});

// calling main process engine every minute
// located in index controller
setInterval( dataCtrl.timingProcess, 60000); 

module.exports = app;
