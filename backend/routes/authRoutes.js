const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {registerValidation} = require('../config/validation');
const validationMiddleware = require('../middleware/validation');


router.post('/register', validationMiddleware(registerValidation) ,  register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);
router.put('/:id' , updateUser)


module.exports = router; 