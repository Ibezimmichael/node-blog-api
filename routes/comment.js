const express = require('express');
const { getAllComments, createComment, updateComment, deleteComment } = require('../controllers/commentContoller');
const router = express.Router();



router.route('/').get(getAllComments).post(createComment);

router.route('/:id').put(updateComment).delete(deleteComment);



module.exports = router;
