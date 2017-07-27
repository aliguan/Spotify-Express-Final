const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');
const geolib               = require('geolib');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const geoRoutes           = express.Router();

const matchedUsers = [];

let newMatchedUser = {
    percentage: '',
    userId: String,
}


geoRoutes.post('/distance', (req, res, next) => {

    const userPos = {
        userEmail: req.body.userEmail,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    let same = 0;


    if (userPos) {
        User.find( { 'email': { $ne: `${req.body.userEmail}`}}, { 'tracks': 1, 'location': 1, 'email': 1 }, (err, otherUsers) => {

            if (!err) {
                matchedUsers.splice(0);
                otherUsers.forEach((otherUser) => {
                    if(otherUser.location[0]) {
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

                                percentage =  Math.round((same / (otherUser.tracks[0].length)) * 100);

                                 newMatchedUser = {
                                    percentage: percentage,
                                    userId: otherUser._id
                                }
                                pushmatches(newMatchedUser);

                            });

                        } else {
                            console.log('No Users In Area');
                        }
                    }
            });

            res.sendStatus(200);
            } else {
               return res.sendStatus(500);
            }


        });
    }
    function pushmatches(newMatchedUser) {
        User.findOne( { 'email': `${req.body.userEmail}`}, (err, loggedinUser) => {
            if(loggedinUser.matchedUsers.length === 0) {
                loggedinUser.matchedUsers.push(newMatchedUser);
                loggedinUser.save((err) => {
                    if (err) {
                        throw err
                    } else {
                        console.log('matches added')
                    }

                });
            } else {
                loggedinUser.matchedUsers.forEach( (alreadymatched) => {

                    if (JSON.stringify(alreadymatched.userId) === JSON.stringify(newMatchedUser.userId) ) {
                        console.log('dont do it');
                    } else {
                        loggedinUser.matchedUsers.push(newMatchedUser);
                        loggedinUser.save((err) => {
                            if (err) {
                                throw err
                            } else {
                                console.log('matches added')
                            }

                        });
                    }
                });
            }
        }
        );
    }

});



module.exports = geoRoutes;
