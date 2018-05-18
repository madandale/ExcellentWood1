/**
 * New node file
 */

// Import dependencies
const passport = require('passport');
const express = require('express');
const config = require('../config/database');
const jwt = require('jsonwebtoken');


 var validator = require("email-validator");

// Set up middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// Load models
const User = require('../models/user');
const Chat = require('../models/chat');

// Export the routes for our app to use
module.exports = function(app) {
  // API Route Section

  // Initialize passport for use
  app.use(passport.initialize());

  // Bring in defined Passport Strategy
  require('../config/passport')(passport);

  // Create API group routes
  const apiRoutes = express.Router();

  // Register new users
  apiRoutes.post('/register', function(req, res) {
    console.log(req.body);
    if(!req.body.email || !req.body.password) {
      res.status(400).json({ success: false, message: 'Please enter email and password.' });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // Attempt to save the user
      newUser.save(function(err) {
        if (err) {
          return res.status(400).json({ success: false, message: 'That email address already exists.'});
        }
        return res.status(201).json({ success: true, message: 'Successfully created new user.' });
      });
    }
  });

  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  apiRoutes.post('/authenticate', function(req, res) {
    var emailId = req.body.email;
    if (!emailId) {
      res.json("Email id should not blank");
    
    } else if (!validator.validate(emailId) ){
      res.json("Please provide valid email id");
      
    }
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            const token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // in seconds
            });
            res.status(200).json({ success: true,user:user, token:"JWT " + token });
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
  });

  // Protect chat routes with JWT
  // GET messages for authenticated user
  apiRoutes.post('/listOf', requireAuth, function(req, res) {
      console.log("allUser successfully");
      	res.send("all user called");
//	  User.findOne({
//	      email: req.body.email},
//	      function(err, user) {
//	          if (err) throw err;  if (err)
//        res.status(400).send(err);
//
//      res.status(400).json(messages);
//    });
  });

 
 

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
