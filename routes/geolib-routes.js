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

    if (userPos) {
        User.find( { 'email': { $ne: `${req.body.userEmail}`}}, (err, otherUsers) => {

            if (!err) {
                matchedUsers.splice(0);
                otherUsers.forEach((user) => {
                    const distance = geolib.getDistance( userPos, user.location[0], 10 );
                    const convertedDist =  geolib.convertUnit('mi', distance, 2);

                    if ( /* convertedDist >= 2 && */ convertedDist <= 25) {
                        User.find({ 'email': `${req.body.userEmail}`}, (err, currentUser) => {
                            console.log(currentUser);
                        });
                        matchedUsers.push(user);
                    } else {
                        console.log('No Users In Area');
                    }

            });
            res.json(matchedUsers);
            } else {
               return res.sendStatus(500);
            }


        });
    }
});


module.exports = geoRoutes;
