const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  questionGeneratedByUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    trim: true
  }],
  promptsGeneratedByUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    trim: true
  }],
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null // Optional, if a user doesn't have a specific admin
  }
});

const validateUser = (userdata) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(userdata);
  return error;
};

const UserCollection = mongoose.model('User', userSchema);

module.exports = {
  UserCollection,
  validateUser
};

