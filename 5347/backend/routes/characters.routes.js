const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const authMiddleware = require('../middlewares/authMiddleware');
const characterController = require('../controllers/character.controller');


// Get role details based on ID
router.get('/:characterId', characterController.getCharacterDetails);

// Update Role Information
router.patch('/:characterId', trimRequest.all, authMiddleware, characterController.editCharacter);

// Gets a list of all characters
router.get('/',  characterController.getAllCharacters);

// delete character
router.put('/:characterId', characterController.editActive);

// Export router
module.exports = router;