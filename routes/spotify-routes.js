const express              = require('express');
const request              = require('request'); // "Request" library
const querystring          = require('querystring');
const cookieParser         = require('cookie-parser');

const spotifyAuthRoutes   = express.Router();

var client_id = '171a4c5c858c492f838a99535c3d3851'; // Your client id
 // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


/* GET home page. */
spotifyAuthRoutes.get('/login', (req, res, next) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-collaborative user-follow-read user-library-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

spotifyAuthRoutes.get()



module.exports = spotifyAuthRoutes;
