var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var detailsSchema = new Schema({
  start: Date,
  end: Date
}, {
    versionKey: false
});

mongoose.model('details', detailsSchema, 'details');