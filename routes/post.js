const express = require('express');
const { getAllPost, getSinglePost, createPost, updatePost, deletePost } = require('../controllers/postController');
const router = express.Router();


router.route('/').get(getAllPost).post(createPost);

router.route('/:id').get(getSinglePost).put(updatePost).delete(deletePost);




module.exports = router;