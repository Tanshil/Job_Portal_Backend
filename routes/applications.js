const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// Submit a job application
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { job } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job,
      student: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = new Application({
      job,
      student: req.user.id
    });

    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application'
    });
  }
});

// Get all applications for a student
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications'
    });
  }
});

// Get all applications for a company's jobs
router.get('/company', protect, authorize('company'), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: 'job',
        match: { company: req.user.id },
        populate: {
          path: 'company',
          select: 'name'
        }
      })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Filter out applications where job is null (job was deleted)
    const filteredApplications = applications.filter(app => app.job);
    
    res.json({
      success: true,
      applications: filteredApplications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications'
    });
  }
});

// Update application status
router.put('/:id', protect, authorize('company'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name'
        }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the job belongs to the company
    if (application.job.company._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating application'
    });
  }
});

module.exports = router; 