const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const Tracks     = require('./tracks-model.js');
const Location   = require('./location-model.js');

const UserSchema = Schema({
    //synonymous to spotify user model
    location: [],
    country: { type: String, optional: true },
    display_name: { type: String, optional: true },
    email: { type: String, optional: true },
    href: { type: String, optional: true },
    id: { type: String, optional: true },
    images:
        [ {
           url: { type: String, default: '../public/images/avatar.png', optional: true }
         }
        ],
    type: { type: String, optional: true },
    uri: { type: String, optional: true },
    tracks: [],
    matchedUsers: []
});

const User = mongoose.model('User', UserSchema);


module.exports = User;
