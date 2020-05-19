/* 
Refactoring idea:
Use this design pattern
https://dev.to/pacheco/designing-a-better-architecture-for-a-node-js-api-24d
*/
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

// set in .env file
const mongoDBConnection = process.env.MONGODB_CONNECTION;

const app = express();
// middleware is parsed top to bottom
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
); // support form data

// support static file serving
app.use('/upload/images', express.static(path.join('upload', 'images')));

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// handle unsupported routes
app.use((req, res, next) => {
  return next(new HttpError('could not find this route', 404));
});

// global error handler
// middleware with 4 params is treated as a special 'error' middleware in express
// will only execute on requests that have an error attached/thrown
app.use((error, req, res, next) => {
  // if request has a multer file and errored, then delete the uploaded file
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headersSent) {
    // response already sent?
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || 'an unknown error occurred.'
  });
});

mongoose.connect(
  mongoDBConnection,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) console.log('mongo error', err);

    app.listen(process.env.PORT || 5000);
  }
);
