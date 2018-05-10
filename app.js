const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const config = require('./config/database');

mongoose.connect(config.database);
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

// misc middleware
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'this is a big secret',
	resave: false,
	saveUninitialized: false}));
app.use(flash());

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(function(req, res, next){
	res.locals.users = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// Home Route
app.get("/", function(req, res, next){
	if (!req.user){
		res.render("landing");
	}
	else {
		// req.flash('error', "Already logged in");
		res.redirect("/" + req.user._id + "/tasks")
	}
});

// Route Files
let userRoutes = require('./routes/users');
app.use(userRoutes);
let taskRoutes = require('./routes/tasks');
app.use(taskRoutes);

var port = process.env.PORT || 8080,
    ip = process.env.IP;

app.listen(port, ip, function(){
    console.log( "Listening on port " + port )
});