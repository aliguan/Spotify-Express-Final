const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = Schema({
  //synonymous to spotify user model
  { country: String,
  display_name: String,
  email: String,
  href: String,
  id: String,
  images:
   [ {
       url: String
     }
   ],
  type: String,
  uri: String,
  tracks: String }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
