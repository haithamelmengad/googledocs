import express from 'express';
import models from './models/models';
import bodyParser from 'body-parser';

const router = express.Router();
const User = models.User;
const Document = models.Document;

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
    // Find if the username already exists in the database
    User.findOne({ username: req.body.username })
    .then((user) => {
      // if the user already exists, send an error message
      if (user) {
        res.send({ error: 'Username already exists. Please enter a unique username' }); // LETS MAKE THIS A MODAL OR A RED MESSAGE BAR AT THE TOP OF THE SCREEN
      } else {
      // ensure that all fields are filled out
        if (req.body.username.length > 0 && req.body.password.length > 0 &&
          req.body.password === req.body.confirmPassword) {
          const user = new User({
            username: req.body.username,
            password: req.body.password,
          });
          user.save((error) => {
            if (error) {
              res.status(500).send({ error });
            } else {
              res.send({ registered: true });
            }
          });
        } else {
          res.status(400).send({ error: 'Please complete all fields' });
        }
      }
    });
  });


  /*
    Uses passport to verify that the password and username match
    a user in the databse.
    Sends a {loggedIn: true} response if login is successful
  */
  router.post('/login', passport.authenticate('jwt'), (req, res) => {
    res.send({ user: req.user, loggedIn: true });
  });


  /*
    Find the document in the database and push its current content to the versions array
    EXPECTED REQUEST: { content: {contentObj} }
  */
  router.post('/document/version/:docId', (req, res) => {
    Document.findByIdAndUpdate(req.params.docId, { $push: { versions: req.body.content }, $set: { title: req.body.title } }, (error, doc) => {
      if (error) {
        console.log(`${error}. The document has not been found`);
      } else {
        res.status(200).send({ saved: true });
      }
    });
  });

  /*
    As the user types, the current content is updated.
    EXPECTED REQUEST: { content: {contentObj} }
  */

  router.post('/document/:docId', (req, res) => {
    Document.findByIdAndUpdate(req.params.docId, { $set: { currentContent: req.content } }, (error, doc) => {
      if (error) {
        console.log(error, 'the document has not been found');
        res.status(500).send({ error });
      } else {
        res.status(200).send({ updated: true });
      }
    });
  });

  /*
    Create a new document for the user
  */
  router.post('/user/:userId', (req, res) => {
    console.log("this is userId " + req.params.userId)
    console.log("this is title " + req.body.title)
    const document = new Document({
      title: req.body.title,
      owner: req.params.userId,
      // contributors: req.body.contributors, // lets not implement this yet
      versions: [req.body.versions],
    });
    document.save((err) => {
      if (err) {
        res.status(500).send({ err });
        console.log(err);
      } else {
        res.status(200).send({ saved: true });
      }
    });
  });

  /*
    Get all Documents owned by the user
  */
  router.get('/user/:userId', (req, res) => {
    Document.find({ owner: req.params.userId }, (error, ownedDocs) => {

      if(req.body.searched){
        ownedDoc
      }
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send({ ownedDocs });
      }
    });
  });

  /*
    Search specific Documents owned by the user using title from request
*/

 router.post('/user/search/:userId', (req, res) => {
   console.log( 'this is title ' + req.body.title );
  Document.find({ title: req.body.title }, (error, ownedDocs) => {
    if (error) {
      res.status(500).send({ error });
    } else {
      res.status(200).send({ ownedDocs });
    }
  });
});

/*
  Get information about a specific document
*/
  router.get('/document/:docId', (req, res) => {
    Document.findById(req.params.docId, (error, doc) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send(doc);
      }
    });
  });

 /*
  Add contributors to the document
  EXPECTED REQUEST: { contributor: userId }
 */
  router.post('/addContributor/:docId', (req, res) => {
    User.findOne({ username: req.body.contributor })
    .then((contributor) => {
      // Add contributors to the document if they do not already exist
      Document.findByIdAndUpdate(req.params.docId, { $addToSet: { contributors: contributor._id } })
      .then(() => {
        res.status(200).send({ contributorAdded: req.body.contributor });
      })
        .catch((error) => {
          res.status(500).send({ error });
        });
    });
  });


  /*
    List contributors for a current document
    sends response: { contributors: [userId] }
  */
  router.get('/contributors/:docId', (req, res) => {
    Document.findById(req.params.docId, (error, doc) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send({ contributors: doc.contributors });
      }
    });
  });

  /*
    Find all the documents that a specific user contributes to
  */
  router.get('/contributor-docs/:userId', (req, res) => {
    Document.find({ contributors: req.params.userId }, (error, docs) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send({ contributedDocs: docs });
      }
    });
  });

  /*
    Delete a specific document from the database
  */
  router.get('/deletedoc/:docId', (req, res) => {
    Document.findOneAndRemove({ _id: req.params.docId }, (error, doc) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send({ deletedDoc: doc });
      }
    });
  });


  // CREATE A LOGOUT BUTTON
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
  return router;
};
