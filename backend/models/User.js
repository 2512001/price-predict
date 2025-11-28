const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxLength: 100
    },
    profileImage: {
        type: String,
        detfault: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?t=st=1744440188~exp=1744443788~hmac=3810f51cc10228df6b31b94517775b2ec944cd7330049c7538d39333cb23d8a4&w=900'
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        default: 'customer'
    },
    phone: {
        type: Number,
        validate: {
            validator: checkLimit,
            message: 'only 10 number required please enter correct number'
        }
    },
    address: {
        type: String,
        maxLength: 300
    }
}, {
    timestamps: true
});


function checkLimit (value){
    const strValue = String(value);

    return strValue.length === 10 && /^[6-9]\d{9}$/.test(strValue);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
