const express = require('express');

const router = express.Router();

const accountRoutes = require('./account');
const userRoutes = require('./user');
const timeRoutes = require('./time');

const authMiddleware = require('../middleware/authMiddleware');

router.use('/account', accountRoutes);
router.use('/user', authMiddleware.authenticate(), userRoutes);
router.use('/time', authMiddleware.authenticate(), timeRoutes);

module.exports = router;
