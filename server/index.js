
import socket from 'socket.io';
import React from 'react';
import crypto from 'crypto';
import passport from 'passport';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import auth from './auth.js';
import Models from './models/models.js';


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// import React from 'react';

// import { Route } from 'react-router-dom';
// import Style from '../src/styles.js';


const connect = process.env.MONGODB_URI;
Mongoose.connect(connect);
const User = Models.User;


const SALT = 'rotten tomatoes are gross';
const sharedDocuments = {};
const currentState = {};

function md5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

io.on('connection', (socket) => {
  console.log('CONNECTED');
  socket.on('join-document', (docAuth, cb) => {
    const { docId, userToken } = docAuth;
    console.log('headers', socket.handshake.headers);

    let secretToken = sharedDocuments[docId];
    if (!secretToken) {
      secretToken = sharedDocuments[docId] = md5(docId + Math.random() + SALT);
    }
    cb({ secretToken, docId, state: currentState[docId] });
    socket.join(secretToken);
  });
  socket.on('document-save', function (message) {
    console.log('saved the doc');
    const {secretToken, state, docId, userToken} = message;
    currentState[docId] = state
    io.sockets.in(secretToken).emit('document-update', {state, docId, userToken})
  });
});

// TO GET THE CURSOR, editorState.getCursor (or something like that)


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SECRET }));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
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
  },
));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', auth(passport));


server.listen(process.env.PORT || 3000, () => console.log('Listening successfully'));
