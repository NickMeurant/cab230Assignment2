const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swaggerpet.json.json");
const cors = require('cors');

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
app.use(cors());
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.db = knex
  next();
})

app.use("/", admin);
app.use("/", auth);
app.use("/", data);
app.use("/", profile);

app.use("/", swaggerUi.serve);
app.get(
  "/",
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }, // Hide schema section
  })
);

app.use(function(req, res, next) {
  return res.status(404).json({
    "status": "error",
    "message": "Page not Found!"
  })
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
})
module.exports = app;
