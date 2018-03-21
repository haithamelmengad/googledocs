import passport from 'passport';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

// import React from 'react';


// import { Route } from 'react-router-dom';
// import Style from '../src/styles.js';
import Models from './models/models.js';


const connect = process.env.MONGODB_URI;
Mongoose.connect(connect);
const User = Models.User;


const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'keyboard cat' }));  // DONT COMMIT THIS

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    // console.log(id, err, user)
    done(err, user);
  });
});


const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  },
));

app.use(passport.initialize());
app.use(passport.session());
