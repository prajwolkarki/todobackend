// controllers/taskController.js
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
};

// Get Single Task
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving task" });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, time, category } = req.body;

        // Validate required fields
        if (!title || !time || !category) {
            return res.status(400).json({ message: "All fields (title, time, category) are required" });
        }

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        // Create new task with userId
        const newTask = new Task({
            title,
            time,
            category,
            userId: req.user._id, // Assign the logged-in user's ID
        });

        const result = await newTask.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating task" });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating task" });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.status(200).json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting task" });
    }
};
const getTasksByUserId = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const tasks = await Task.find({ userId });

        if (!tasks) {
            return res.status(404).json({ message: "No tasks found" });
        }

        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Export all functions
module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTasksByUserId
};
