const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = ("./docs/swaggerpet.json");

const options = require('./knexfile.js');
const knex = require('knex')(options);

const admin = require("./routes/administration");
const auth = require("./routes/authentication");
const data = require("./routes/data");
const profile = require("./routes/profile");

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use((req, res, next) => {
  req.db = knex
  next();
})

app.use("/", admin);
app.use("/", auth);
app.use("/", data);
app.use("/", profile);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
