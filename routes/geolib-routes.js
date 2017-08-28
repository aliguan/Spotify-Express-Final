const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');
const geolib               = require('geolib');
const intersection         = require('array-intersection');
const compare              = require('array-compare');
const diff                = require('array-difference');

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const geoRoutes           = express.Router();

const matchedUsersDist = [];

let newMatchedUser = {
    percentage: '',
    userId: String,
}
let currentuseremail = '';
geoRoutes.post('/distance', (req, res, next) => {

    const userPos = {
        userEmail: req.body.userEmail,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    currentuseremail = req.body.userEmail;

    function checkIfMatchedAlready(addThese, currentUser) {

        otherArray = addThese;
        currentUserAr = currentUser.matchedUsers;

        let otherArray2 = otherArray.map((otherId) => {
            return JSON.stringify(otherId.userId);
        })

        let currentUserAr2 = currentUserAr.map((matchedids) => {
            return JSON.stringify(matchedids.userId);
        })

        let uniqueVals = diff(otherArray2, currentUserAr2 );
        let uniqueVals2 = uniqueVals.map((oneVal) => {
            return JSON.parse(oneVal);
        })
        // Add new songs
        uniqueVals2.map((oneId) => {
            addThese.forEach((matchedUser) =>{
                if(oneId == matchedUser.userId) {
                    User.findById({ '_id': `${currentUser._id}`}, (err, theUser) => {
                        theUser.matchedUsers.push(matchedUser);
                        theUser.save((err) => {
                            if(err) { throw err}
                            else {
                                console.log('i added stuff');
                            }
                        });
                    });


                } else {
                    console.log('no new things to add')
                }
            })
        })

    }

    function findSimilarities(distMatched) {
        let count = 0
        let percentageArray = [];
        User.find({'email': `${userPos.userEmail}`}, {'tracks': 1, 'location': 1, 'email': 1, 'matchedUsers': 1}, (err, currentUser) => {
            if(!currentUser[0].tracks[0]) {
                console.log('please add tracks');
                return;
                //implement pop up to tell user to add tracks
            }
                distMatched.forEach((distUser, index, array) => {
                    count ++;
                    let same = intersection(currentUser[0].tracks[0], distUser.tracks[0]);
                    newMatchedUser = {
                           percentage: Math.round((same.length/currentUser[0].tracks[0].length) * 100),
                           userId: distUser._id
                    }
                    if(currentUser[0].matchedUsers.length === 0) {
                        currentUser[0].matchedUsers.push(newMatchedUser);
                        currentUser[0].save((err) => {
                            if(err) {
                                throw err
                            } else {
                                console.log('i did it the first!');
                            }
                        });
                    }
                    percentageArray.push(newMatchedUser);
                    if(count === array.length) {
                            checkIfMatchedAlready(percentageArray, currentUser[0]);
                    }

                });

        });

    }

    function matchedIntersect(matchedUsers) {

        User.find({ 'email': `${req.body.userEmail}`}, (err, currentUser) => {
            let alreadyMatched = intersection(currentUser[0].matchedUsers[0], matchedUsers);
        })
    }
    let count = 0
    let inRadius = [];
    if (userPos) {
        User.find( { 'email': { $ne: `${req.body.userEmail}`}}, { 'tracks': 1, 'location': 1, 'email': 1 }, (err, otherUsers) => {

            if (!err) {
                matchedUsersDist.splice(0);
                otherUsers.forEach((otherUser, index, array) => {
                    count++
                    if(otherUser.location[0]) {
                        const distance = geolib.getDistance( userPos, otherUser.location[0], 10 );
                        const convertedDist =  geolib.convertUnit('mi', distance, 2);

                        if(convertedDist <= 25) {
                            inRadius.push(otherUser);

                            if(count === array.length) {
                                findSimilarities(inRadius);
                            }
                        }


                    }


                } );
            }
        });
    }
    res.sendStatus(200);
});

geoRoutes.post('/getMatchedUsers', (req, res, next) => {
    //Send matched user percentage compatibility to angular 
    let matchedUsers = [];

    let count = 0
    User.findOne({ 'email': `${req.body.email}` }, (err, user) => {
        // if(matchedUsers.length === 0) {
        //     res.sendStatus(404)
        // }
        user.matchedUsers.forEach((matcheduser, index, array) => {
            let finalUser = {
                percentage: matcheduser.percentage,
                user: ''
            }
            User.find({'_id': `${matcheduser.userId}`}, (err, otherUser) => {
                count++
                finalUser.user = otherUser;
                matchedUsers.push(finalUser);
                if(count === array.length) {
                    res.json(matchedUsers);
                }
            })
        })
    })
});

geoRoutes.post('/addFriend', (req, res, next) => {

    User.findOne({ 'email': `${req.body.userEmail}`}, (err, currentUser) => {
        if(err) { return res.status(500).json(err); };
        if(currentUser) {
                if(currentUser.friends.indexOf(req.body.friendId) === -1 ) {
                    currentUser.friends.push(req.body.friendId);
                    currentUser.save((err) => {
                        if(err) {
                            throw err
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    console.log('you friends already')
                }

        }
    })

});



module.exports = geoRoutes;
