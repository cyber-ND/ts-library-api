# Error Log

This document tracks errors encountered during development and testing, and how they were resolved.
This file is safe to read — no sensitive information is included.

---

## Error 1 — `next is not a function`

**When:** Testing POST `/auth/register`

**Error:**
```json
{
  "message": "next is not a function"
}
```

**Cause:**
Two causes were found:

1. `express-validator` version 7+ changed how middleware arrays work. The validation array was being passed directly to Express routes without being spread, causing Express to receive an array instead of individual middleware functions.

2. The Mongoose `pre("save")` hook in `User.js` was using `async function(next)` and calling `next()` manually. In async Mongoose hooks, `next` does not behave the same as Express middleware `next` — this caused a conflict.

**Fix 1 — Spread the validation array in routes:**
```javascript
// wrong
router.post("/register", validateRegister, register);

// correct
router.post("/register", ...validateRegister, register);
```

**Fix 2 — Remove `next` from async Mongoose hook:**
```javascript
// wrong
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// correct
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
```

---

## Error 2 — `E11000 duplicate key error`

**When:** Testing POST `/auth/register` after a failed attempt

**Error:**
```json
{
  "message": "E11000 duplicate key error collection: library-api.students index: email_1 dup key"
}
```

**Cause:**
A previous failed registration attempt had already created a `Student` document before the `User` document creation failed. This left an orphaned student record in the database with that email, blocking future registration attempts with the same email.

**Fix:**
Clear orphaned documents from the students collection before retrying. Long term fix is to use MongoDB transactions or clean up before creating:
```javascript
await Student.findOneAndDelete({ email });
```

---

## Error 3 — `403 Forbidden` on attendant routes

**When:** Testing PUT `/authors/:id` with a valid token

**Error:**
```json
{
  "message": "Forbidden, attendant role required"
}
```

**Cause:**
Case mismatch between the role stored in the database and the role being checked in middleware. The database stored `"Attendant"` with a capital A but the middleware was checking for `"attendant"` in lowercase.

**Fix:**
```javascript
// wrong
if (req.user && req.user.role === "attendant")

// correct
if (req.user && req.user.role === "Attendant")
```

---

## Error 4 — Author search not returning results

**When:** Testing GET `/books?search=authorname`

**Cause:**
The search was applying a MongoDB regex query on `title` field before populating authors. This meant author name search never worked because the filter ran at the database level before author documents were joined.

**Fix:**
Remove the pre-query title filter and instead fetch all books first, populate authors, then filter in JavaScript where both title and author name are accessible:
```javascript
const books = await Book.find()
  .populate("authors")
  .populate("borrowedBy")
  .populate("issuedBy");

if (search) {
  results = books.filter((book) => {
    const titleMatch = book.title.match(new RegExp(search, "i"));
    const authorMatch = book.authors.some((a) =>
      a.name.match(new RegExp(search, "i"))
    );
    return titleMatch || authorMatch;
  });
}
```

---

## Error 5 — Student can update other students profiles

**When:** Testing PUT `/students/:id` with a student token

**Cause:**
The update route only checked if the user was logged in but did not verify that the student was updating their own profile.

**Fix:**
Added `restrictToOwnProfile` middleware that checks if the logged in user's profile ID matches the ID in the request params:
```javascript
const restrictToOwnProfile = async (req, res, next) => {
  if (req.user.role === "Attendant") return next();
  if (req.user.profile.toString() !== req.params.id) {
    return res.status(403).json({ message: "You can only update your own profile" });
  }
  next();
};
```