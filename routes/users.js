var express = require('express');
var router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

let Task = require('../models/posts');
let User = require('../models/users');

router.get("/signup", function(req, res){
	if (!req.user){
		res.render("signup");
	}
	else {
		req.flash('error', "Successfully signed up.");
		res.redirect('/' + req.user._id + '/tasks');
	}
});

router.post("/signup", function(req, res){
	let user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(user.password, salt, function(err, hash){
			if (err){
				req.flash('error', "Error occurred");
				res.redirect('/signup');
			}
			user.password = hash;
			user.save(function(err){
				if (err){
					req.flash('error', "Error occurred");
					res.redirect('/signup');
				}
				else {
					req.login(user, function(err) {
					  if (err) { return next(err); }
					  return res.redirect('/' + user._id + '/tasks');
					});
				}
			});
		});
	})
});

router.get("/login", function(req, res){
	if (!req.user){
		res.render("login");
	}
	else {
		req.flash('error', "Already logged in");
		return res.redirect('/' + user._id + '/tasks');
	}
});

router.post("/login",
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true,
	}),
    function(req, res) {
    	req.flash('success', "Successfully logged in.");
  		res.redirect('/' + req.user._id + '/tasks');
  	}
);

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', "Successfully logged out.");
  res.redirect('/');
});

module.exports = router;
