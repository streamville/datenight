const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String,
    required: true 
  },
  website: {
    type: String 
  },
  status: {
    type: String,
  },
  skills: {
    type: Array,
    required: true 
  },
  location: {
    type: String 
  },
  bio: {
    type: String 
  },
   experience: [
    {
      title: {
        type: String,
        required: true 
      },
      company: {
        type: String,
        required: true 
      },
      from: {
        type: String,
        required: true 
      },
      to: {
        type: String,
        required: true 
      },
      description: {
        type: String,
      }
    }
  ],
  social: {
    youtube: {
      type: String 
    },
    twitter: {
      type: String 
    },
    facebook: {
      type: String 
    },
    linkedin: {
      type: String 
    },
    instagram: {
      type: String 
    }
  },
  date: {
    type: Date,
    default: Date.now 
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);