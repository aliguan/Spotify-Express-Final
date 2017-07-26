const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const Tracks     = require('./tracks-model.js');
const Location   = require('./location-model.js');

const MatchedUserSchema = Schema({
    percentage: Number,
    userId: String
})

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
    // matchedUsers: [ MatchedUserSchema ]
});

const User = mongoose.model('User', UserSchema);
const MatchedUser = mongoose.model('MatchedUser', MatchedUserSchema);

module.exports = MatchedUser;
module.exports = User;
