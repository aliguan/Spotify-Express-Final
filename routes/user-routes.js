const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');

const User                 = require('../models/user-model.js');

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
        tracks: 'hi',
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



module.exports = userRoutes;
