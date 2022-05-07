const express = require('express');
const {
    createPost, 
    likeAndUnlikePost, 
    deletePost, 
    getPostsOfFollowing, 
    updateCaption,
    addCommentsOnPost,
    deleteComment,
    singlePostUpdate,
    getMyPosts,
} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route('/post/upload').post(isAuthenticated, createPost);
router.route('/post/:id')
.get(isAuthenticated, likeAndUnlikePost)
.put(isAuthenticated, updateCaption)
.delete(isAuthenticated, deletePost);

// getMyPost Route
router.route('/my/posts').get(isAuthenticated, getMyPosts);

router.route('/posts').get(isAuthenticated, getPostsOfFollowing);
router.route('/post/comment/:id')
.put(isAuthenticated, addCommentsOnPost)
.delete(isAuthenticated, deleteComment);
router.route('/single/post/update').post(isAuthenticated, singlePostUpdate);


module.exports = router;