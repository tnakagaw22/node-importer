var mongoose = require('mongoose');
const keys = require('../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

module.exports = {mongoose};