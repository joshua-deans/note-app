var express = require('express');
var router = express.Router();
const passport = require('passport');

// Database models
let Task = require('../models/posts');
let User = require('../models/users');

// Main task page
router.get("/:user_id/tasks", function(req, res){
	if (req.user){
		if (req.user._id.equals(req.params.user_id)){
			Task.find({"user":req.user._id}, function(err, tasks){
				if (err){
					console.log(err);
					req.flash('error', "Error occurred");
					res.redirect("/");
				}
				else {
					res.render("index", {tasks:tasks.reverse()});
				}
			});
		}
		else {
			req.flash('error', 'Unauthorized access');
			res.redirect("/" + req.user._id + "/tasks");
		}
	}
	else {
		req.flash('error', 'Not logged in');
		res.redirect("/");
	}
});

// Task submit post request
router.post("/:user_id/tasks", function(req, res){
	// if user is logged in and matches the page
	if (req.user && req.user._id.equals(req.params.user_id)){
		let task = new Task();
		task.task = req.body.task;
		task.date = req.body.date;
		task.user = req.user._id;

		task.save(function(err){
			if (err){
				console.log(err);
				req.flash('error', "Error occurred");
				res.status(500).send({ error: 'Error occurred!' });
				return;
			}
			else {
				res.send(task);
			}
		})
	}
	else {
		req.flash('error', "Not authorized");
		res.redirect("/");
		return;
	}
});

// Task update put request
router.put("/:user_id/tasks/:task_id", function(req, res){
	// if user is logged in and matches the page
	if (req.user && req.user._id.equals(req.params.user_id)){
		Task.findByIdAndUpdate(req.params.task_id, {task: req.body.taskEdit, date: req.body.dateEdit}, function(err){
			if (err){
				console.log(err);
				res.status(500).send({ error: 'Error occurred!' });
				return;
			}
			else {
				res.send({taskEdit: req.body.taskEdit, dateEdit: req.body.dateEdit});
			};
		})
	}
	else {
		req.flash('error', "Not authorized");
		res.redirect("/");
		return;
	}
});

// Task delete request
router.delete("/:user_id/tasks/:task_id", function(req, res){
	if (req.user && req.user._id.equals(req.params.user_id)){
		Task.findByIdAndRemove(req.params.task_id, function(err){
			if (err){
				console.log(err);
				req.flash('error', "Error occured");
				res.status(500).send({ error: 'Error occurred!' });
			}
			else {
				res.send("Task deleted");
				return;
			}
		});	
	}
	else {
		req.flash('error', "Not authorized");
		res.redirect("/");
		return; 
	}
});

// Error page (redirects to task page or landing page)
router.get("/*", function(req, res){
	if (req.user && req.user._id.equals(req.params.user_id)){
		res.redirect("/" + req.user._id + "/tasks");
	}
	else {
		req.flash('error', 'Not logged in');
		res.redirect("/");
	}
});

module.exports = router;