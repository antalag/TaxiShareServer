
var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var userSchema = new Schema({  
  name:    { type: String },
  email:     { type: String },
  password:  { type: String },
  location:   {
    type: Array,  // [<longitude>, <latitude>]
    index: '2dsphere'      // create the geospatial index
    },
  active:  { type: Boolean },
  description:    { type: String}
});

module.exports = mongoose.model('User', userSchema);  