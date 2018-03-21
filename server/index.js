import passport from 'passport';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import auth from './auth.js';
// import React from 'react';

// import { Route } from 'react-router-dom';
// import Style from '../src/styles.js';
import Models from './models/models.js';

const app = express();
const connect = process.env.MONGODB_URI;
Mongoose.connect(connect);
const User = Models.User;


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


app.listen(process.env.PORT || 3000, () => console.log('Listening successfully'));
