var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user/users');
var superuserRouter = require('./routes/superuser/superuser');
const acaraRouter = require('./routes/user/acara');
const createAcaraRouter = require('./routes/user/createAcara');
const detailAcaraRouter = require('./routes/user/detailAcara');
const kontribusiUangRouter = require('./routes/user/kontribusiUang');
const kontribusiBarangRouter = require('./routes/user/kontribusiBarang');
const profilRouter = require('./routes/user/profil');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Should be true if using HTTPS
}));

// Setup flash middleware
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/superuser', superuserRouter);
app.use('/users/acara', acaraRouter);
app.use('/users/create_acara', createAcaraRouter);
app.use('/users/acara', detailAcaraRouter);
app.use('/users/kontribusi_uang', kontribusiUangRouter);
app.use('/users/kontribusi_barang', kontribusiBarangRouter);
app.use('/users/profile', profilRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
