const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const dotenv       = require('dotenv');
const request      = require('request');
const querystring  = require('querystring');
const cors         = require('cors');
const geolib       = require('geolib');

dotenv.config();


mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/spotifydb');
mongoose.connect('mongodb://heroku_rghc0ctw:ej3rl9os1dvhikp6ub5hcusjve@ds127993.mlab.com:27993/heroku_rghc0ctw');
// mongoose.createConnection(process.env.MONGODB_URI);

var mongoDB = mongoose.connection;

const app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Spotify Database';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

const index = require('./routes/index');
app.use('/', index);

const spotifyAuthRoutes = require('./routes/spotify-routes');
app.use('/', spotifyAuthRoutes);

const userRoutes = require('./routes/user-routes');
app.use('/', userRoutes);

const geoRoutes = require('./routes/geolib-routes');
app.use('/', geoRoutes);

const chatRoutes = require('./routes/chat');
app.use('/chat', chatRoutes);


app.use((req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
