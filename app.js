var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');

const indexRouter = require('./routes/index');
const detailAcaraRoutes = require('./routes/user/detailAcara');
const kontribusiUangRoutes = require('./routes/user/kontribusiUang');
const kontribusiBarangRoutes = require('./routes/user/kontribusiBarang');
const acaraRoutes = require('./routes/user/acara');
const createAcaraRoutes = require('./routes/user/createAcara');
const dashboardRoutes = require('./routes/user/dashboard');
const detailInvestasiRoutes = require('./routes/user/detailInvestasi');
const investasiRoutes = require('./routes/user/investasi');
const profilRoutes = require('./routes/user/profil');
const superuserRoutes = require('./routes/superuser/superuser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./config/scheduler');

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
  cookie: { secure: false } 
}));

// Setup flash middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/', indexRouter);
app.use('/users/detail_acara', detailAcaraRoutes);
app.use('/users/kontribusi_uang', kontribusiUangRoutes);
app.use('/users/kontribusi_barang', kontribusiBarangRoutes);
app.use('/users/acara', acaraRoutes);
app.use('/users/create_acara', createAcaraRoutes);
app.use('/users/dashboard', dashboardRoutes);
app.use('/users/detail_investasi', detailInvestasiRoutes);
app.use('/users/investasi', investasiRoutes);
app.use('/users/profile', profilRoutes);
app.use('/superuser', superuserRoutes);

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
