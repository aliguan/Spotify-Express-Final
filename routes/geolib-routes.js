const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');
const geolib               = require('geolib');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const geoRoutes           = express.Router();

const matchedUsers = [];


geoRoutes.post('/distance', (req, res, next) => {

    const userPos = {
        userEmail: req.body.userEmail,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    let same = 0;

    if (userPos) {
        User.find( { 'email': { $ne: `${req.body.userEmail}`}}, { 'tracks': 1, 'location': 1 }, (err, otherUsers) => {

            if (!err) {
                matchedUsers.splice(0);
                otherUsers.forEach((otherUser) => {
                    const distance = geolib.getDistance( userPos, otherUser.location[0], 10 );
                    const convertedDist =  geolib.convertUnit('mi', distance, 2);

                    //if users are within 25 miles radius, find the percentage that the libraries match
                    if ( /* convertedDist >= 2 && */ convertedDist <= 25) {
                        User.find({ 'email': `${req.body.userEmail}`}, (err, currentUser) => {
                            currentUser[0].tracks[0].forEach((artist) => {
                                otherUser.tracks[0].forEach((otherArtist) => {
                                    if(artist === otherArtist) {
                                        same += 1;
                                    }
                                });
                            });
                            let newMatchedUser = {
                                percentage: Math.round((same / (otherUser.tracks[0].length)) * 100),
                                user: otherUser._id,
                            }

                            matchedUsers.push(newMatchedUser);
                            res.json(matchedUsers);
                        });

                    } else {
                        console.log('No Users In Area');
                    }
            });

            } else {
               return res.sendStatus(500);
            }


        });
    }
});


module.exports = geoRoutes;
