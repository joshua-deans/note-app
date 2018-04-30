let mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
const taskSchema = new Schema({
 author: ObjectId,
 task: String,
 date: Date
});

module.exports = mongoose.model('Task', taskSchema);