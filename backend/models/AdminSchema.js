const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = require('mongoose');

const adminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['Admin', 'SuperAdmin'],
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  managedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
});

const validateAdmin = (adminData) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Admin', 'SuperAdmin')
  });

  const { error } = schema.validate(adminData);
  return error;
};

const AdminCollection = mongoose.model('Admin', adminSchema);

module.exports = {
  AdminCollection,
  validateAdmin
};