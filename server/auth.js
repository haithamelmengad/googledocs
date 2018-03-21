import express from 'express';
import models from './models/models';

const router = express.Router();
const User = models.User;

// var validator = require('express-validator');

module.exports = (passport) => {
    /*
        Post request to /register:
        Verifies the form completion and adds a user to the database
        if the passwords are the same.
        Sends {registered: true} response if the
        user is successfully registered.
    */
  router.post('/register', (req, res) => {
    console.log('Body', req.body);
    if (req.body.username.length > 0 && req.body.password.length > 0 &&
        req.body.password === req.body.confirmPassword) {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });
      user.save((error) => {
        if (error) {
          console.log(error);
          res.status(500).send({ error });
        } else {
          res.send({ registered: true });
          console.log('Saved!');
        }
      });
    } else {
      res.status(400).send({ error: 'Please complete all fields' });
    }
  });

  /*
    Uses passport to verify that the password and username match
    a user in the databse
    Sends a {loggedIn: true} response if login is successful
  */
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send({ loggedIn: true });
  });


//   {
//     successRedirect: '/register',                                         //SHOULD I USE THIS?
//     failureRedirect: '/login',
//   }
//                                                             // CREATE A LOGOUT BUTTON
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
  return router;
};
