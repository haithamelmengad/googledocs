'use strict';

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

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

var _auth = require('./auth.js');

var _auth2 = _interopRequireDefault(_auth);

var _models = require('./models/models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// import React from 'react';

// import { Route } from 'react-router-dom';
// import Style from '../src/styles.js';


var connect = process.env.MONGODB_URI;
_mongoose2.default.connect(connect);
var User = _models2.default.User;

var SALT = 'rotten tomatoes are gross';
var sharedDocuments = {};
var currentState = {};

function md5(data) {
  return _crypto2.default.createHash('md5').update(data).digest('hex');
}

io.on('connection', function (socket) {
  console.log('CONNECTED');
  socket.on('join-document', function (docAuth, cb) {
    var docId = docAuth.docId,
        userToken = docAuth.userToken;

    console.log('headers', socket.handshake.headers);

    var secretToken = sharedDocuments[docId];
    if (!secretToken) {
      secretToken = sharedDocuments[docId] = md5(docId + Math.random() + SALT);
    }
    cb({ secretToken: secretToken, docId: docId, state: currentState[docId] });
    socket.join(secretToken);
  });
  socket.on('document-save', function (message) {
    console.log('saved the doc');
    var secretToken = message.secretToken,
        state = message.state,
        docId = message.docId,
        userToken = message.userToken;

    currentState[docId] = state;
    io.sockets.in(secretToken).emit('document-update', { state: state, docId: docId, userToken: userToken });
  });
});

// TO GET THE CURSOR, editorState.getCursor (or something like that)


app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.use((0, _expressSession2.default)({ secret: process.env.SECRET }));

_passport2.default.serializeUser(function (user, done) {
  done(null, user._id);
});

_passport2.default.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;

_passport2.default.use(new LocalStrategy(function (username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    console.log('USER', user);
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    console.log('Got to the end');
    return done(null, user);
  });
}));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use('/', (0, _auth2.default)(_passport2.default));

server.listen(process.env.PORT || 3000, function () {
  return console.log('Listening successfully');
});