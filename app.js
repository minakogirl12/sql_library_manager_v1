var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;

var indexRouter = require('./routes');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error pages
  if(err.status === 404){
    res.render('page-not-found', err);
  }
  else{
    res.status(err.status || 500);
    err.status = 500;
    err.message = "Something has gone very wrong. Error code: ";
    res.render('error', {title:"Not Found", err});
  }
 
});

//set port to 3000
app.set('port', process.env.PORT || 3000);

//test the database connection
(async () => {
  try{
    await sequelize.authenticate();
    console.log('Connection has been established to the database');
  }
  catch(error){
    console.error('Unablet to connect to the database: ', error);
  }
})();

//Sequelize model sychronization
sequelize.sync();

module.exports = app;
