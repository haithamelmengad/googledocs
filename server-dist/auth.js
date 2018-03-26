'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('./models/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var User = _models2.default.User;
var Document = _models2.default.Document;
var Content = _models2.default.Content;

// var validator = require('express-validator');

module.exports = function (passport) {
  /*
    Post request to /register:
    Verifies the form completion and adds a user to the database
    if the passwords are the same.
    Sends {registered: true} response if the
    user is successfully registered.
  */
  router.post('/register', function (req, res) {
    console.log('Body', req.body);
    if (req.body.username.length > 0 && req.body.password.length > 0 && req.body.password === req.body.confirmPassword) {
      var user = new User({
        username: req.body.username,
        password: req.body.password
      });
      user.save(function (error) {
        if (error) {
          console.log(error);
          res.status(500).send({ error: error });
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
    a user in the databse.
    Sends a {loggedIn: true} response if login is successful
  */
  router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('Check req.user (make sure it has _id): ', req.user);
    res.send({ user: req.user, loggedIn: true });
  });

  /*
    Find the document in the database and push its current content to the versions array
    EXPECTED REQUEST: { content: {contentObj} }
  */
  router.post('/document/version/:docId', function (req, res) {
    console.log('this is req.conent ' + req.body.content);
    Document.findByIdAndUpdate(req.params.docId, { $push: { versions: req.body.content }, $set: { title: req.body.title } }, function (error, doc) {
      if (error) {
        console.log(error + '. The document has not been found');
      } else {
        console.log('Versioned up the Existing Document!');
        res.status(200).send({ saved: true });
      }
    });
  });

  /*
    As the user types, the current content is updated.
    EXPECTED REQUEST: { content: {contentObj} }
  */

  router.post('/document/:docId', function (req, res) {
    Document.findByIdAndUpdate(req.params.docId, { $set: { currentContent: req.content } }, function (error, doc) {
      if (error) {
        console.log(error, 'the document has not been found');
      } else {
        console.log('Updated the current document in the database!');
        res.send({ updated: true });
      }
    });
  });

  /*
    Create a new document for the user
  */
  router.post('/user/:userId', function (req, res) {
    var document = new Document({
      title: req.body.title,
      owner: req.params.userId,
      // contributors: req.body.contributors, // lets not implement this yet
      versions: [req.body.versions]
    });
    document.save(function (err) {
      if (err) {
        res.status(500).send({ err: err });
        console.log(err);
      } else {
        res.status(200).send({ saved: true });
        console.log('Saved New Document!');
      }
    });
  });

  /*
    Get all Documents owned by the user
  */
  router.get('/user/:userId', function (req, res) {
    Document.find({ owner: req.params.userId }, function (error, ownedDocs) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send({ ownedDocs: ownedDocs });
        console.log("Sent all documents associated with user " + req.params.userId);
      }
    });
  });

  /*
    get all the documents that the user contributes to
    TEMPORARY --> DONT IMPLEMENT YET
  */

  router.get('/user/:userId', function (req, res) {
    Document.find({ contributors: req.params.userId });
  });

  /*
    Get information about a specific document
  */
  router.get('/document/:docId', function (req, res) {
    Document.findById(req.params.docId, function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send(doc);
        console.log("Sent document " + req.params.docId);
      }
    });
  });

  /*
   Add contributors to the document
   EXPECTED REQUEST: { contributor: userId }
  */
  router.post('/addContributor/:docId', function (req, res) {
    Document.findByIdAndUpdate(req.params.docId, { $push: { contributors: req.body.contributor } }, function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send({ contributorAdded: req.body.contributor });
        console.log('Added contributor', req.body.contributor, 'to document ', docId);
      }
    });
  });

  /*
    List contributors for a current document
    sends response: { contributors: [userId] }
  */
  router.get('/contributors/:docId', function (req, res) {
    Document.findById(req.params.docId, function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send({ contributors: doc.contributors });
        console.log('Listed contributors');
      }
    });
  });

  /*
    Find all the documents that a specific user contributes to
  */
  router.get('/contributor-docs/:userId', function (req, res) {
    Document.find({ contributors: req.params.userId }, function (error, docs) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send({ contributedDocs: docs });
        console.log('Listed the docs that the user contributes to');
      }
    });
  });

  router.get('/deletedoc/:docId', function (req, res) {
    console.log("Made it to the back end");
    Document.findOneAndRemove({ _id: req.params.docId }, function (error, doc) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: error });
      } else {
        res.status(200).send({ deletedDoc: doc });
        console.log('deleted document');
      }
    });
  });

  // CREATE A LOGOUT BUTTON
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
  });
  return router;
};