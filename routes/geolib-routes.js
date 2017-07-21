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
    const distance = geolib.getDistance( userPos, { latitude: 25.761681, longitude: -80.191788 }, 10 )
    console.log('You are ' + geolib.convertUnit('mi', distance, 2) + ' miles from Miami');
    res.sendStatus(200);
});


module.exports = geoRoutes;
