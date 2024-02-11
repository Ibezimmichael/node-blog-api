const express = require('express');
const { getAllPost, getSinglePost, createPost, updatePost, deletePost } = require('../controllers/postController');
const validateToken = require('../middlewares/validateToken');
const { likes } = require('../controllers/postLikesController');
const storage = require('../config/cloudinary');
const multer = require("multer");
const router = express.Router();
const upload = multer({storage});


router.route('/').get(validateToken, getAllPost).post(validateToken, upload.single('image'), createPost);
router.post("/likes/:id", validateToken, likes);

router.route('/:id').get(validateToken, getSinglePost).put(validateToken, upload.single('image'), updatePost).delete(validateToken, deletePost);




module.exports = router;