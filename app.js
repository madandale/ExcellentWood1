
//express setup

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');
var multer = require('multer');


var login = require('./controllers/login');
//var product = require('./controllers/product');

var fileUploads = require('./controllers/UploadFiles');

var indexes = require('./routes/index');

var http = require('http');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8080);
//app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Initialize Passport and restore authentication state, if any, from the
//session.
app.use(passport.initialize());

//connect to database
mongoose.Promise = global.Promise;
//mongoose.createConnection(config.database);
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	  console.log('Database connection opened');
});

//mongoose.connect(config.database);

//index page
app.use('/', indexes);
//login route
login(app); 
//product(app); 
fileUploads(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

  module.exports = app;
  

