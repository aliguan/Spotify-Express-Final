const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');

const userRoutes           = express.Router();

userRoutes.post('/newUser', (req, res, next) => {

    const newUser = new User ({
        country: req.body.country,
        display_name: req.body.display_name,
        email: req.body.email,
        href: req.body.href,
        id: req.body.id,
        // images:
        //     [{
        //        url: req.body.images[0].url,
        //      }
        //     ],
        type: req.body.type,
        uri: req.body.uri,
        tracks: [],
    });
    console.log('new user made');
    //Prevent Mulitple users from being created

    User.findOne({ 'email': `${req.body.email}` }, (err, user) => {
        if(err) { console.log('err from findone'); return res.status(500).json(err) };
        if( user ) {
            console.log( user + ' was found' );
        } else {
            newUser.save( (err) => {
                console.log('trying to save');
                if (err)            { return res.status(500).json(err) }
                if (newUser.errors) { return res.status(400).json(newUser) }
                return true;
            });
        }

    });

});

userRoutes.post('/userTracks', (req, res, next) => {

    const newTracks = new Tracks ({
        artistNames: req.body.artistNames,
        userEmail: req.body.userEamil
    });

    User.findOne({ 'email': `${req.body.userEmail}` }, (err, userFound) => {
        if(err) { console.log('err from findone'); return res.status(500).json(err) };
        if( userFound ) {
            if (userFound.tracks[0] === newTracks.artistNames){
                console.log('leave me alone');
            } else {
                userFound.tracks.push(newTracks.artistNames);
                userFound.save( (err) => {
                    if (err) { throw err }
                    console.log("Tracks Added!");
                });
            }
        }

    });

});



module.exports = userRoutes;
