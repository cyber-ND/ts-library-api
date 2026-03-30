const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Attendant = require("../models/Attendant");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profile;
    if (role === "Student") {
      // check if student with email already exists and clean it up
      await Student.findOneAndDelete({ email });
      profile = await Student.create({
        name,
        email,
        studentId: `STU-${Date.now()}`,
      });
    } else if (role === "Attendant") {
      profile = await Attendant.create({
        name,
        staffId: `ATT-${Date.now()}`,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      profile: profile._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: profile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("profile");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };