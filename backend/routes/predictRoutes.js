
const express = require("express");
const router = express.Router();
const { predictPrice } = require('../controllers/predictController');

router.post('/predict', predictPrice);

module.exports = router;