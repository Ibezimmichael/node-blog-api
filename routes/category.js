const express = require('express');
const { getAllCategories, createCategory, getSingleCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const validateToken = require('../middlewares/validateToken');
const router = express.Router();


router.route('/').get(getAllCategories).post(validateToken, createCategory);
router.route('/:id').get(getSingleCategory).put(validateToken, updateCategory).delete(validateToken, deleteCategory);


module.exports = router;
