const express = require('express');
const { getAllCategories, createCategory, getSingleCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();


router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').get(getSingleCategory).put(updateCategory).delete(deleteCategory);


module.exports = router;
