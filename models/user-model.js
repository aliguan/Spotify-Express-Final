const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const Tracks     = require('./tracks-model.js');
const Location   = require('./location-model.js');

const UserSchema = Schema({
    //synonymous to spotify user model
    location: [],
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
    tracks: [],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
