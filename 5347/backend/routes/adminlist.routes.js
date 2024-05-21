const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const authMiddleware = require('../middlewares/authMiddleware');
const userlistController = require('../controllers/userlist.controller');

router.get('/:userId', trimRequest.all, authMiddleware, userlistController.getUserById);
router.patch('/:userId', trimRequest.all, authMiddleware, userlistController.updateUser);
router.get('/:userId/profile', trimRequest.all, authMiddleware, userlistController.getUserProfile);
router.post('/:userId/favorites/:characterId', trimRequest.all, authMiddleware, userlistController.favoriteCharacter);
router.delete('/:userId/contributions/:contributionId', trimRequest.all, authMiddleware, userlistController.revokeContribution);

module.exports = router;