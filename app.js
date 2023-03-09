const express = require('express');
const router = express();
const mongoose = require('mongoose');
const bodyparser = require("body-parser");


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
const PORT = 5000;
router.listen(PORT,console.log(`Server started at port ${PORT}`));


// Connect to MongoDB database
mongoose.connect('mongodb+srv://arun:arun@cluster0.dijmoid.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Define email tracking schema
const emailSchema = new mongoose.Schema({
  email: String,
  timestamp: Date,
  hitCount: Number
});

// Create email tracking model
const Email = mongoose.model('Email', emailSchema);

// Define GET email tracking API endpoint
router.get('/track', async (req, res) => {
  const email  = req.body.email;

  try {
    // Check if email exists in database
    let emailRecord = await Email.findOne({ email });

    if (!emailRecord) {
      // If email doesn't exist, return error response
      res.status(404).json({ error: 'Email not found' });
      return;
    }

    // If email exists, update hit count and timestamp
    emailRecord.hitCount++;
    emailRecord.timestamp = new Date();
    console.log(emailRecord)
    // Save updated record to database
    await emailRecord.save();

    // Return updated email record as JSON
    res.status(200).json(emailRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Define POST email tracking API endpoint
router.post('/track', async (req, res) => {
  const  hitCount  = 1;
  const email = req.body.email;
  const timestamp = new Date()
  try {
    // Create new email record
    const emailRecord = new Email({
      email: email,
      timestamp: timestamp,
      hitCount: hitCount
    });

    // Save new record to database
    await emailRecord.save();

    // Return new email record as JSON
    res.status(201).json(emailRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
