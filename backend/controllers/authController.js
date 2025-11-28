const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Admin'
        });


        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'Admin'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password, ADMIN_SECRET_KEY } = req.body;

        const userData = await User.findOne({ email }).select('+password');

        if (!userData) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, userData.password);


        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // if (ADMIN_SECRET_KEY) {
        //     return ADMIN_SECRET_KEY !== process.env.ADMIN_SECRET_KEY;
        // }

        const access_token = jwt.sign(
            {
                id: userData._id,
                role: userData.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );

        const refresh_token = jwt.sign(
            {
                id: userData._id,
                role: userData.role
            },
            process.env.JWT_SECRET__REFRESH_TOKEN,
            {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
            }
        );

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 60 * 60 * 1000
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        const user = userData.toObject();
        delete user.password;

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const isUser = await User.findById(id);
        if (!isUser) {
            return res.status(401).json({ message: 'user not found' })
        }

        Object.assign(isUser, req.body);
        await isUser.save();
        const user = isUser.toObject();
        delete user.password
        res.status(201).json({
            message: 'user updated successfully', user
        })
    } catch (error) {
        console.log(error.message);

    }
}