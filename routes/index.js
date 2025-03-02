const express = require('express');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');
const router = express.Router();

router.use('/tasks',taskRoutes);
router.use('/users',userRoutes);

module.exports = router;


