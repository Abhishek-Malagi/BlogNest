const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.clearCookie('token');
        req.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    if (!req.user) return res.redirect('/login');
    next();
};

const requireAuthor = (model) => {
    return async (req, res, next) => {
        const doc = await model.findById(req.params.id);
        if (!doc || doc.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        next();
    };
};

module.exports = { verifyUser, requireAuth, requireAuthor };
