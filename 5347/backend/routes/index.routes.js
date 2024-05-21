const express = require('express');
const router = express.Router();

// Import routes for each model
const adminlistRoutes = require('./adminlist.routes');
const contributionsRoutes = require('./contributions.routes');
const favouritesRoutes = require('./favourites.routes');
const userlistRoutes = require('./userlist.routes');
const authController = require('../controllers/auth.controller');
const charactersRoutes = require('./characters.routes');

// Use routing for each model
router.post('/api/login', authController.login);
router.use('/adminlist', adminlistRoutes);
router.use('/api/contributions', contributionsRoutes);
router.use('/api/favourites', favouritesRoutes);
router.use('/api/users', userlistRoutes);
router.use('/api/characters', charactersRoutes)

module.exports = router;