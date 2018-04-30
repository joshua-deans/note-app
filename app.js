const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/note_database');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
	console.log(err);
});

var app = express();

// Bring in Models
let Task = require('./models/posts');
let User = require('./models/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// bodyParser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/tasks", function(req, res){
	Task.find({}, function(err, tasks){
		if (err){
			console.log(err);
		}
		else {
			res.render("index", {user: "Joshua", tasks:tasks.reverse()});
		}
	});
});

// Task submit post request
app.post("/tasks", function(req, res){
	let task = new Task();
	task.task = req.body.task;
	task.date = Date.now();

	task.save(function(err){
		if (err){
			console.log(err);
			return;
		}
		else {
			res.redirect('back');
		}
	})
});

app.delete("/tasks/:id", function(req, res){
	Task.findByIdAndRemove(req.params.id, function(err){
		if (err){
			console.log(err);
			return;
		}
		else {
			res.redirect('back');
		}
	});	
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", function(req, res){
	res.render("login");
});

app.get("/signup", function(req, res){
	res.render("signup");
});

app.post("/signup", function(req, res){
	let user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(user.password, salt, function(err, hash){
			if (err){
				console.log(err);
			}
			user.password = hash;
			user.save(function(err){
				if (err){
					console.log(err);
					res.redirect('/signup');
				}
				else {
					res.redirect('/tasks');
				}
			});
		});
	})
	
});

var port = process.env.PORT || 8080,
    ip = process.env.IP;

app.listen(port, ip, function(){
    console.log( "Listening on port " + port )
});

function passportMiddleware(){
	passport.authenticate('local', { successRedirect: '/tasks',
                                   failureRedirect: '/',
                                   failureFlash: true });
}