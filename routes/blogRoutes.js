const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');
const { requireAuth, verifyUser, requireAuthor } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create form
router.get('/new', verifyUser, requireAuth, (req, res) => {
    res.render('create', { user: req.user });
});

// Create post
router.post('/', verifyUser, requireAuth, upload.single('thumbnail'), async (req, res) => {
    const { title, body } = req.body;
    const blog = new Blog({
        title,
        body,
        thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
        author: req.user._id,
    });
    await blog.save();
    res.redirect('/');
});

router.get('/:id', verifyUser, async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate('author')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        });

    res.render('blog', { blog, user: req.user });
});

// Edit form
router.get('/edit/:id', verifyUser, requireAuth, requireAuthor(Blog), async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render('edit', { blog, user: req.user });
});

// Update post
router.put('/:id', verifyUser, requireAuth, requireAuthor(Blog), upload.single('thumbnail'), async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.title = req.body.title;
    blog.body = req.body.body;
    if (req.file) blog.thumbnail = `/uploads/${req.file.filename}`;
    await blog.save();
    res.redirect('/');
});

// Delete post
router.delete('/:id', verifyUser, requireAuth, requireAuthor(Blog), async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;
