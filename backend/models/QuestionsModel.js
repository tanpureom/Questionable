const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = require('mongoose');
// const JoiObjectId = require('joi-objectid')(Joi);

const QuestionSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuestionsCollection = mongoose.model('Question', QuestionSchema);

const validateQuestions = (question) => {
  const schema = Joi.object({
    filename: Joi.string().required(),
    questionText: Joi.string().required(),
    createdAt: Joi.date().default(Date.now)
  });

  const { error } = schema.validate(question);
  return error;
};

module.exports = {
  QuestionsCollection,
  validateQuestions
};