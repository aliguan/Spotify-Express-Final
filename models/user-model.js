const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = Schema({
  //synonymous to spotify user model
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
