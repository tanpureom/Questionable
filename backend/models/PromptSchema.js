const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = require('mongoose');

const promptSchema = mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const validatePrompt = (prompt) => {
  const schema = Joi.object({
    prompt: Joi.string().required(),
    response: Joi.string().required(),
    createdAt: Joi.date().default(Date.now)
  });

  const { error } = schema.validate(prompt);
  return error;
};


const PromptCollection = mongoose.model('Prompt', promptSchema);

module.exports = {
  PromptCollection,
  validatePrompt
};