const router = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getMyProfile,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyProfile);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
