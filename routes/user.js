const express = require('express');
const { login, register, profile, getUsers, updateUser, deleteUser, uploadPhoto } = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');
const storage = require('../config/cloudinary');
const router = express.Router();
const multer = require('multer');

const upload = multer({storage});

router.post('/register', register);

router.post('/login', login);

router.get('/profile/',validateToken, profile);

router.get('/', getUsers);

router.route('/:id').put(updateUser).delete(deleteUser);

router.post('/photo-upload', validateToken, upload.single('profile'),  uploadPhoto)



module.exports = router;