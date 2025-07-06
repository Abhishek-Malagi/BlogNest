const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { verifyUser, requireAuth } = require('../middleware/auth');

router.post('/:blogId', verifyUser, requireAuth, async (req, res) => {
    const { blogId } = req.params;
    const comment = new Comment({
        text: req.body.comment,
        blog: blogId,
        author: req.user._id,
    });
    await comment.save();

    const blog = await Blog.findById(blogId);
    blog.comments.push(comment._id);
    await blog.save();

    res.redirect(`/blogs/${blogId}`);
});


module.exports = router;
