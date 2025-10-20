const { ObjectId } = require("mongodb");

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: ['true', 'First name is required.'],
  },
  lastName: {
    type: String,
  },
  userType: [{
    type: String,
    enum: ['guest', 'host'],
    required: true,
    
  }]
});

module.exports = mongoose.model('User', userSchema);