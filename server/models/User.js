const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'company', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'pending'],
    default: 'pending'
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified', 'pending'],
    default: 'unverified'
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'commercial', 'other']
    },
    url: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
