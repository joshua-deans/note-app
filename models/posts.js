let mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
const taskSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	task: String,
	date: Date
});

module.exports = mongoose.model('Task', taskSchema);