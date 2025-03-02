// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
// Import all functions from the controller
const taskController = require('../controllers/taskController');



// Define routes
router.get('/',taskController.getAllTasks); // GET all tasks
//router.get('/:id', taskController.getTask); // GET a single task
router.post('/', taskController.createTask); // POST a new task
router.patch('/:id', taskController.updateTask); // PUT (update) a task
router.delete('/:id', taskController.deleteTask); // DELETE a task
router.get('/user', taskController.getTasksByUserId);

module.exports = router;