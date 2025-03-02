const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Work', 'Personal','Freelance'] 
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);
