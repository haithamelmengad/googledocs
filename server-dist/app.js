'use strict';

var _passport = require('passport');
var _passport2 = _interopRequireDefault(_passport);

var _express = require('express');
var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');
var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');
var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');
var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');
var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');
var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');
var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _models = require('./models/models.js');
var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connect = process.env.MONGODB_URI;

_mongoose2.default.connect(connect);
var User = _models2.default.User;

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.use((0, _expressSession2.default)({ secret: 'keyboard cat' })); // DONT COMMIT THIS

_passport2.default.serializeUser(function (user, done) {
  done(null, user._id);
});

_passport2.default.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    // console.log(id, err, user)
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;

_passport2.default.use(new LocalStrategy(function (username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
