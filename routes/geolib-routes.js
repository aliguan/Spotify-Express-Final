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
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }

    if (userPos) {
        User.find( {}, (err, users) => {

            if (!err) {
                matchedUsers.splice(0);
                users.forEach((user) => {
                    const distance = geolib.getDistance( userPos, user.location[0], 10 );
                    const convertedDist =  geolib.convertUnit('mi', distance, 2);

                    if (convertedDist <= 25) {
                        matchedUsers.push(user._id);
                    } else {
                        console.log('No Users In Area');
                    }

            });
            console.log(matchedUsers);
            res.sendStatus(200);
            } else {
               return res.sendStatus(500);
            }


        });
    }
});

// geoRoutes.get('/matchedusers', (req, res))


module.exports = geoRoutes;
