// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrCode = require("qrcode");
const axios = require("axios")

require("dotenv").config();

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

// Get Single User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

// Create a New User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    const result = await newUser.save();

    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedUserObject = {};
    if (name) updatedUserObject.name = name;
    if (email) updatedUserObject.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserObject.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedUserObject,
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({
        message: "User deleted successfully",
        deletedUser: deletedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  res
    .status(200)
    .json({ message: "User Logged In Successfully", user: req.user });
};
const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User is logged in",
      user: req.user,
      authenticated: true,
    });
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
};
const logoutUser = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "User not logged In" });
  }
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.status(200).json({ message: "User logged out successfully" });
  });
};
const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user);
    let secret = speakeasy.generateSecret();
    //    console.log(secret);
    user.twoFASecret = secret.base32;
    user.isMFA = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.name}`,
      issuer: "TODO Application",
      encoding: "base32",
    });
    // console.log(url);
    const qrImageUrl = await qrCode.toDataURL(url);
    res
      .status(200)
      .json({ message: "2FA setup successfully", qrCode: qrImageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting up 2FA", error: error.message });
  }
};
const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;
  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token,
  });
  if (verified) {
    res.status(200).json({ message: "Token verified successfully" });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};
const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.isMFA = false;
    user.twoFASecret = "";
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting 2FA", error: error.message });
  }
};


const payment = async (req, res) => {
    try {
        const data = req.body;

        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/initiate/",
            data,
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, 
                    "Content-Type": "application/json", 
                },
            }
        );

        res.json(response.data); 
    } catch (error) {
        console.error("Error initiating payment:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment initiation failed" });
    }
};


// Export all functions
module.exports = {
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  authStatus,
  logoutUser,
  setup2FA,
  verify2FA,
  reset2FA,
  payment
};
