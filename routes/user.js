const express = require('express');
const { login, register, getUsers, updateUser, deleteUser, profileViewers } = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');
const storage = require('../config/cloudinary');
const router = express.Router();
const multer = require('multer');
const { follow, unFollow } = require('../controllers/userFollowController');
const { block, unblock } = require('../controllers/userBlockController');
const isAdmin = require('../middlewares/isAdmin');
const { adminBlock, adminUnblock } = require('../controllers/adminUserActionsController');
const { updatePassword, uploadPhoto, profile } = require('../controllers/userProfileController');
const upload = multer({storage});
uploadPhoto

router.post('/register', register);

router.post('/login', login);

router.get('/profile',validateToken, profile);

router.get('/', getUsers);

// profile management
router.get('/profile-viewers/:id', validateToken, profileViewers);
router.post('/update-password', validateToken, updatePassword);


// follow router
router.post("/follow/:id", validateToken, follow);
router.post("/unfollow/:id", validateToken, unFollow);

// block router
router.post("/block/:id", validateToken, block);
router.post("/unblock/:id", validateToken, unblock)


// admin block
router.post("/admin-block/:id", validateToken, isAdmin, adminBlock);
router.post("/admin-unblock/:id", validateToken, isAdmin, adminUnblock);


router.route('/').put(validateToken, updateUser).delete(validateToken, deleteUser);

router.post('/photo-upload', validateToken, upload.single('profile'),  uploadPhoto)



module.exports = router;