const express = require("express");
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook, getOverdueBooks } = require("../controllers/bookController");
const { protect, requireAttendant } = require("../middleware/auth");
const { validateBook, validateBookUpdate, validateBorrow } = require("../middleware/validate");

router.get("/", protect, getAllBooks);
router.get("/overdue", protect, requireAttendant, getOverdueBooks);
router.get("/:id", protect, getBookById);
router.post("/", protect, requireAttendant, ...validateBook, createBook);
router.put("/:id", protect, requireAttendant, ...validateBookUpdate, updateBook);
router.delete("/:id", protect, requireAttendant, deleteBook);
router.post("/:id/borrow", protect, ...validateBorrow, borrowBook);
router.post("/:id/return", protect, returnBook);

module.exports = router;