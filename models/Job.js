const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  location: { 
    type: String,
    trim: true
  },
  type: { 
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time'
  },
  salary: { 
    type: String,
    trim: true
  },
  requirements: { 
    type: String,
    trim: true
  },
  benefits: { 
    type: String,
    trim: true
  },
  deadline: { 
    type: Date
  },
  postedAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  }
});

// Add index for better search performance
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema); 