const router = require('express').Router();
const express = require('express');
const {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', express.json(), createUser);
router.patch('/users/me', express.json(), updateUserProfile);
router.patch('/users/me/avatar', express.json(), updateUserAvatar);

module.exports = router;
