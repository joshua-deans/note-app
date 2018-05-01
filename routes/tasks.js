var express = require('express');
var router = express.Router();

const passport = require('passport');

let Task = require('../models/posts');
let User = require('../models/users');

router.get("/:user_id/tasks", function(req, res){
	if (req.user){
		if (req.user._id.equals(req.params.user_id)){
			Task.find({"user":req.user._id}, function(err, tasks){
				if (err){
					console.log(err);
					req.flash('error', err);
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
	if (req.user && req.user._id.equals(req.params.user_id)){
		let task = new Task();
		task.task = req.body.task;
		task.date = Date.now();
		task.user = req.user._id;

		task.save(function(err){
			if (err){
				console.log(err);
				req.flash('error', err);
				res.redirect('back');
			}
			else {
				req.flash('success', "Successfully added task");
				res.redirect('back');
			}
		})
	}
	else {
		req.flash('error', "Not authorized");
		res.redirect('back');
	}
});

router.delete("/:user_id/tasks/:task_id", function(req, res){
	if (req.user && req.user._id.equals(req.params.user_id)){
		Task.findByIdAndRemove(req.params.task_id, function(err){
			if (err){
				console.log(err);
				req.flash('error', err);
				return;
			}
			else {
				req.flash('success', "Successfully delete task");
				res.redirect('back');
			}
		});	
	}
	else {
		req.flash('error', "Not authorized");
		res.redirect('back');
	}
});

module.exports = router;
