const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const authMiddleware = require('../middlewares/authMiddleware');
const userlistController = require('../controllers/userlist.controller');
const authController = require('../controllers/auth.controller');
const adminlistController = require('../controllers/adminlist.controller');


// Create a user
router.post('/', trimRequest.all, userlistController.createUser);

// View user list
router.get('/', trimRequest.all, userlistController.getAllUser);

// register
router.post('/register', authController.register);

// Define a route to get the detailed profile
router.get('/:userId/profile', userlistController.getUserProfile);
router.post('/login', authController.login);

// Get User Details
router.get('/:userId',  userlistController.getUserById);

// Update user information
router.patch('/:userId', trimRequest.all, authMiddleware, userlistController.updateUser);

// Edit administrator rights
router.put('/:userId/role', adminlistController.editRole);

// Users themselves revoke pending contributions
router.patch('/revoke/:contributionId', userlistController.revoke);
// 添加其他需要的用户相关路由
module.exports = router;