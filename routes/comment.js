const express = require('express');
const { createComment, updateComment, deleteComment } = require('../controllers/commentContoller');
const validateToken = require('../middlewares/validateToken');

const router = express.Router();


// create comment 
// post id required
router.route('/:id').post(validateToken, createComment);

router.route('/:id').put(validateToken, updateComment).delete(validateToken, deleteComment);



module.exports = router;
