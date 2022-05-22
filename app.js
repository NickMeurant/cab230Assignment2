const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = ("./docs/swaggerpet.json");
const jwt = require("jsonwebtoken");

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


app.use((req, res, next) => {
  req.db = knex
  next();
})

// app.use((req,res,next) => {
//   if(req.headers.authorization){
//     const token = req.headers.authorization.split(" ")[1];
//     jwt.verify(token, "secret key", (err, user) => {
//       if(err){
//         res.status(401).json({
//           error: true,
//           message: "Authorization header is malformed"
//         })
//         res.end();
//         return;
//       }
//       next();
//     })
//   }
//   next();
// })

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use("/", admin);
app.use("/", auth);
app.use("/", data);
app.use("/", profile);

module.exports = app;
