const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitContactForm } = require('../controllers/ContactController');

router.route('/')
    .post(submitContactForm);




module.exports = router;    