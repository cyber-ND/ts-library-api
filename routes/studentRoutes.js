const express = require("express");
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require("../controllers/studentController");
const { protect, requireAttendant, restrictToOwnProfile } = require("../middleware/auth");
const { validateStudent, validateStudentUpdate } = require("../middleware/validate");

router.get("/", protect, requireAttendant, getAllStudents);
router.get("/:id", protect, getStudentById);
router.post("/", protect, requireAttendant, ...validateStudent, createStudent);
router.put("/:id", protect, restrictToOwnProfile, ...validateStudentUpdate, updateStudent);
router.delete("/:id", protect, requireAttendant, deleteStudent);

module.exports = router;