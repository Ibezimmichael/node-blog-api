const express = require('express');
const { login, register, profile, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken')
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile/:id',validateToken, profile);

router.get('/', getUsers);

router.route('/:id').put(updateUser).delete(deleteUser);




module.exports = router;