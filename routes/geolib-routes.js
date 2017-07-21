const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');
const geolib               = require('geolib');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const geoRoutes           = express.Router();

geoRoutes.post('/distance', (req, res, next) => {

    const userPos = {
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }

    const matchedUsers = [];

    User.find( {}, (err, userLocations) => {
        if (!err) {

            const distance = geolib.getDistance( userPos, userLocations.location[0], 10 );
            const convertedDist =  geolib.convertUnit('mi', distance, 2);
            if (convertedDist <= 25) {
                matchedUsers.push(userLocations);
                console.log(matchedUsers);
            }

        } else {
           return res.sendStatus(500);
        }


    });

});


module.exports = geoRoutes;
