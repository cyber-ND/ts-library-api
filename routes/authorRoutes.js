const express = require("express");
const router = express.Router();
const { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } = require("../controllers/authorController");
const { protect, requireAttendant } = require("../middleware/auth");
const { validateAuthor, validateAuthorUpdate } = require("../middleware/validate");

router.get("/", protect, getAllAuthors);
router.get("/:id", protect, getAuthorById);
router.post("/", protect, requireAttendant, ...validateAuthor, createAuthor);
router.put("/:id", protect, requireAttendant, ...validateAuthorUpdate, updateAuthor);
router.delete("/:id", protect, requireAttendant, deleteAuthor);

module.exports = router;