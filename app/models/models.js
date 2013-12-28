
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/' + 'backendPro');

module.exports = mongoose;