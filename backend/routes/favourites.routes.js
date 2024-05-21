const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const authMiddleware = require('../middlewares/authMiddleware');
const favouritesController = require('../controllers/favourites.controller');

// Get user favorites
router.get('/:userId', trimRequest.all, authMiddleware, favouritesController.getFavouritesByUserId);

// Add a role to Favorites
router.post('/:userId/characters/:characterId', trimRequest.all, authMiddleware, favouritesController.addCharacterToFavourites);

// Remove a character from Favorites
router.delete('/:userId/characters/:characterId', trimRequest.all, authMiddleware, favouritesController.removeCharacterFromFavourites);

module.exports = router;