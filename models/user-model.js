const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = Schema({
    //synonymous to spotify user model
    firstname: String, 
    lastname: String,
    country: String,
    display_name: String,
    email: String,
    href: String,
    id: String,
    // images:
    //     [ {
    //        url: { type: String, default: '../public/images/avatar.png' }
    //      }
    //     ],
    type: String,
    uri: String,
    tracks: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
