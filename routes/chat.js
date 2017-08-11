var express = require('express');
var chatrouter = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Chat = require('../models/chat-model.js');
var User = require('../models/user-model.js');

server.listen(4000);

// socket io
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });
});

/* GET ALL CHATS */
chatrouter.get('/:room', function(req, res, next) {
  Chat.find({ room: req.params.room }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE CHAT */
chatrouter.post('/', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

chatrouter.post('/getFriends', (req, res, next) => {
    friends = [];
    count = 0;
    User.findOne({ 'email': `${req.body.email}`}, { 'friends': 1 }, (err, currentUser) => {
        if(err) { return res.status(500).json(err); };
        if(currentUser) {
            currentUser.friends.forEach((friend) => {
                User.findOne({'_id': friend}, (err, frienddata) => {
                    count ++
                    friends.push(frienddata);
                    if(currentUser.friends.length === count) {
                        res.json(friends);
                        // friends = [];
                        // count = 0;
                    }
                })
            });
        }
    })

});

module.exports = chatrouter;
