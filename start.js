// Imports
require('dotenv').config();
const mongoose = require('mongoose');

require('./models/Registration');
const app = require('./app');

// Get current environment
const currEnv = process.env.NODE_ENV;

// Connect to database based on environment
if(currEnv !== 'production') mongoose.connect(process.env.DEV_DATABASE);
else mongoose.connect(process.env.PROD_DATABASE);

mongoose.Promise = global.Promise;
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connection open on "${currEnv}" environment.`);
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});