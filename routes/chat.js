var express = require('express');
var chatRouter = express.Router();

chatRouter.get('/', function(req, res, next) {
  res.send('Express REST API');
});

module.exports = chatRouter;
