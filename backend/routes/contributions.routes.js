const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const authMiddleware = require('../middlewares/authMiddleware');
const contributionsController = require('../controllers/contributions.controller');

// router.post('/', trimRequest.all, authMiddleware, contributionsController.createContribution);
// router.post('/', contributionsController.createContribution);

router.post('/', authMiddleware, contributionsController.addCharacter);

router.put('/:characterId', authMiddleware, contributionsController.editCharacter);

router.put('/:contributionId/review', authMiddleware, contributionsController.reviewContribution);


// router.get('/:contributionId', trimRequest.all, authMiddleware, contributionsController.getContributionById);

// Get contribution history
router.get('/history', contributionsController.getContributionHistory);

// Update contribution status
router.patch('/:contributionId/status', trimRequest.all, authMiddleware, contributionsController.updateContributionStatus);

// Add additional contribution related routes as needed

module.exports = router;