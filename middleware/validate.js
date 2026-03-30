const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateAuthor = [
  body("name").notEmpty().withMessage("Name is required"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  handleValidationErrors,
];

const validateStudent = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email"),
  handleValidationErrors,
];

const validateAttendant = [
  body("name").notEmpty().withMessage("Name is required"),
  handleValidationErrors,
];

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("isbn").notEmpty().withMessage("ISBN is required"),
  body("authors")
    .isArray({ min: 1 })
    .withMessage("At least one author ID is required"),
  handleValidationErrors,
];

const validateBorrow = [
  body("studentId").notEmpty().withMessage("Student ID is required"),
  body("attendantId").notEmpty().withMessage("Attendant ID is required"),
  body("returnDate")
    .notEmpty()
    .withMessage("Return date is required")
    .isISO8601()
    .withMessage("Return date must be a valid date format eg. 2026-04-01")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Return date must be in the future");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Attendant", "Student"])
    .withMessage("Role must be either Attendant or Student"),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateAuthorUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  handleValidationErrors,
];

const validateStudentUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  handleValidationErrors,
];

const validateAttendantUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  handleValidationErrors,
];

const validateBookUpdate = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("isbn").optional().notEmpty().withMessage("ISBN cannot be empty"),
  body("authors")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one author ID is required"),
  handleValidationErrors,
];

module.exports = {
  validateAuthor,
  validateStudent,
  validateAttendant,
  validateBook,
  validateBorrow,
  validateRegister,
  validateLogin,
  validateAuthorUpdate,
  validateStudentUpdate,
  validateAttendantUpdate,
  validateBookUpdate
};