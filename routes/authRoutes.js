const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validate");

// authRoutes.js
router.post("/register", ...validateRegister, register);
// Note: The validateLogin middleware is spread to ensure that all validation errors are captured and handled properly before reaching the login controller.
router.post("/login", ...validateLogin, login);

module.exports = router;