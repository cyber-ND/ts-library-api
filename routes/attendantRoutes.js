const express = require("express");
const router = express.Router();
const { createAttendant, getAllAttendants, getAttendantById, updateAttendant, deleteAttendant } = require("../controllers/attendantController");
const { protect, requireAttendant } = require("../middleware/auth");
const { validateAttendant, validateAttendantUpdate } = require("../middleware/validate");

router.get("/", protect, getAllAttendants);
router.get("/:id", protect, getAttendantById);
router.post("/", protect, requireAttendant, ...validateAttendant, createAttendant);
router.put("/:id", protect, requireAttendant, ...validateAttendantUpdate, updateAttendant);
router.delete("/:id", protect, requireAttendant, deleteAttendant);

module.exports = router;