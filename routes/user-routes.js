const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const userRoutes           = express.Router();

userRoutes.post('/newUser', (req, res, next) => {

    const newUser = new User ({
        country: req.body.country,
        display_name: req.body.display_name,
        email: req.body.email,
        href: req.body.href,
        id: req.body.id,
        images:
            [{
               url: req.body.images[0].url,
             }
            ],
        type: req.body.type,
        uri: req.body.uri,
        tracks: [],
    });
    console.log('new user made');
    //Prevent Mulitple users from being created

    User.findOne({ 'email': `${req.body.email}` }, (err, user) => {
        if(err) { return res.status(500).json(err) };
        if( user ) {
            console.log('user already in database');
            res.sendStatus(200);
        } else {
            newUser.save( (err) => {
                console.log('trying to save');
                if (err)            { return res.status(500).json(err) }
                if (newUser.errors) { return res.status(400).json(newUser) }
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
            //Don't add tracks if they are duplicates
                if (JSON.stringify(userFound.tracks[0]) === JSON.stringify(newTracks.artistNames))
                {
                    console.log('leave me alone');
                    res.sendStatus(200);
                } else {
                // add tracks to User
                    userFound.tracks.splice(0, userFound.tracks.length);
                    userFound.tracks.push(newTracks.artistNames);
                    userFound.save( (err) => {
                        if (err) { throw err }
                        console.log("Tracks Added!");
                    });
                }
        }

    });

});

userRoutes.post('/location', (req, res, next) => {
    const newLocation = new Location({
        coordinates: req.body.coordinates,
        userEmail: req.body.userEmail
    });

    User.findOne({ 'email': `${req.body.userEmail}` }, (err, userFound) => {
        if(err) { console.log('err from findone'); return res.status(500).json(err) };
        if( userFound ) {
            User.update({'_id': userFound._id },{ $pull:{ 'location': {} } }, (err, updateLocUser) =>{
                if(err) { return res.status(500).json(err) };
                if(updateLocUser) {
                    userFound.location.push(newLocation.coordinates);
                    userFound.save( (err) => {
                        if (err) { throw err }
                        console.log("location Added!");
                    });
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });

        }

    });
});



module.exports = userRoutes;
