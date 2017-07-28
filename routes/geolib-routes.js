const express              = require('express');
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');
const geolib               = require('geolib');
const intersection         = require('array-intersection');
const diff                 = require('arr-diff')

const User                 = require('../models/user-model.js');
const Tracks               = require('../models/tracks-model.js');
const Location             = require('../models/location-model.js');

const geoRoutes           = express.Router();

const matchedUsersDist = [];

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

    function checkIfMatchedAlready(addThese, currentUser) {
        otherArray = addThese;
        currentUserAr = currentUser.matchedUsers[0];
        let uniqueVals = diff(otherArray, currentUserAr);
        console.log(uniqueVals);
        console.log(currentUser.email)
        if(uniqueVals.length > 0) {
            User.findOne({'email': `${currentUser.email}`}, (err, changeThisUser) => {
                uniqueVals.forEach((uniqueVal) => {
                    changeThisUser.matchedUsers[0].push(uniqueVal);
                    changeThisUser.save((err) => {
                         if (err) {
                            throw err
                        } else {
                            console.log('i did iferwertt!');
                        };
                    });
                })
            });

        } else {
            console.log('all the values are the same');
        }
    }

    function findSimilarities(distMatched) {
        let count = 0
        let percentageArray = [];
        User.find({'email': `${userPos.userEmail}`}, {'tracks': 1, 'location': 1, 'email': 1, 'matchedUsers': 1}, (err, currentUser) => {
            if(currentUser[0].tracks[0]) {
                distMatched.forEach((distUser, index, array) => {
                    count ++;

                    let poop = intersection(currentUser[0].tracks[0], distUser.tracks[0]);
                    newMatchedUser = {
                           percentage: Math.round((poop.length/distUser.tracks[0].length) * 100),
                           userId: distUser._id
                    }
                    percentageArray.push(newMatchedUser);
                    if(count === array.length) {
                        if(currentUser[0].matchedUsers.length === 0) {
                            currentUser[0].matchedUsers.push(percentageArray);
                            currentUser[0].save((err) =>{
                                if(err) {
                                    throw err
                                } else {
                                    console.log('i did it!');
                                }
                            });
                        } else {
                            checkIfMatchedAlready(percentageArray, currentUser[0]);
                        }
                    }

                });
            } else {
                console.log('please add tracks');
            }
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


                }, );
            }
        });
    }


});



module.exports = geoRoutes;
