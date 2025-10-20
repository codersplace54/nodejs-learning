const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: Date,
    completed: { 
        type: Boolean, 
        default: false 
    },
    
},{
    timestamps: true
});

module.exports = mongoose.model('TodoItem', todoItemSchema);