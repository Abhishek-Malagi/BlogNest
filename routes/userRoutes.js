const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyUser } = require('../middleware/auth');

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// GET Register
router.get('/register', verifyUser, (req, res) => {
    if (req.user) return res.redirect('/');
    res.render('register', { error: null, user: null }); // ✅ user defined
});

// POST Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'User already exists or invalid input', user: null }); // ✅ user defined
    }
});

// GET Login
router.get('/login', verifyUser, (req, res) => {
    if (req.user) return res.redirect('/');
    res.render('login', { error: null, user: null }); // ✅ user defined
});

// POST Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { error: 'Invalid email or password', user: null }); // ✅ user defined
        }
        const token = createToken(user._id);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch {
        res.render('login', { error: 'Something went wrong', user: null }); // ✅ user defined
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
