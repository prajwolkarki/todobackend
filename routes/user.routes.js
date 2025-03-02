// routes/taskRoutes.js
const express = require("express");
const router = express.Router();

// Import all functions from the controller
const userController = require("../controllers/userController");
const passport = require("passport");
const checkRole = require("../middleware/roleMiddleware");

// Define routes
router.get("/", checkRole("admin"), userController.getAllUsers);
router.post("/register", userController.registerUser);
router.patch("/:id", checkRole("admin","user"),userController.updateUser);
router.delete("/:id",checkRole("admin","user"), userController.deleteUser);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  userController.loginUser
);
router.get("/status", userController.authStatus);
//router.get("/:id", userController.getUser);
router.get(
  "/logout",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "User not authenticated" });
  },
  userController.logoutUser
);
router.get(
  "/setup2FA",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "User not authenticated" });
  },
  userController.setup2FA
);
router.post(
  "/verify2FA",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "User not authenticated" });
  },
  userController.verify2FA
);
router.get(
  "/reset2FA",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "User not authenticated" });
  },
  userController.reset2FA
);
router.post("/payment", userController.payment);

module.exports = router;
