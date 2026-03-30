# Key Performance Indicators (KPI)

This document outlines all features implemented in the School Library Management API and their current status.

---

## Core Requirements

### Models
| Feature | Status | Notes |
|---|---|---|
| Author model | Implemented | name, bio, timestamps |
| Book model | Implemented | title, isbn, authors, status, borrowedBy, issuedBy, returnDate, timestamps |
| Student model | Implemented | name, email, studentId, timestamps |
| Attendant model | Implemented | name, staffId, timestamps |
| Relationships between models | Implemented | Book references Author, Student and Attendant via ObjectId |

---

### Author Endpoints
| Endpoint | Method | Status |
|---|---|---|
| Create author | POST `/authors` | Implemented |
| Get all authors | GET `/authors` | Implemented |
| Get single author | GET `/authors/:id` | Implemented |
| Update author | PUT `/authors/:id` | Implemented |
| Delete author | DELETE `/authors/:id` | Implemented |

---

### Book Endpoints
| Endpoint | Method | Status |
|---|---|---|
| Create book | POST `/books` | Implemented |
| Get all books | GET `/books` | Implemented |
| Get single book | GET `/books/:id` | Implemented |
| Update book | PUT `/books/:id` | Implemented |
| Delete book | DELETE `/books/:id` | Implemented |

---

### Student Endpoints
| Endpoint | Method | Status |
|---|---|---|
| Create student | POST `/students` | Implemented |
| Get all students | GET `/students` | Implemented |
| Get single student | GET `/students/:id` | Implemented |
| Update student | PUT `/students/:id` | Implemented |
| Delete student | DELETE `/students/:id` | Implemented |

---

### Attendant Endpoints
| Endpoint | Method | Status |
|---|---|---|
| Create attendant | POST `/attendants` | Implemented |
| Get all attendants | GET `/attendants` | Implemented |
| Get single attendant | GET `/attendants/:id` | Implemented |
| Update attendant | PUT `/attendants/:id` | Implemented |
| Delete attendant | DELETE `/attendants/:id` | Implemented |

---

### Borrow and Return Logic
| Feature | Status | Notes |
|---|---|---|
| Borrow book | Implemented | POST `/books/:id/borrow` |
| Return book | Implemented | POST `/books/:id/return` |
| Book must be IN to borrow | Implemented | Returns 400 if already borrowed |
| Book must be OUT to return | Implemented | Returns 400 if not currently borrowed |
| Sets borrowedBy on borrow | Implemented | References Student ObjectId |
| Sets issuedBy on borrow | Implemented | References Attendant ObjectId |
| Sets returnDate on borrow | Implemented | Must be a future date |
| Clears all fields on return | Implemented | borrowedBy, issuedBy, returnDate all set to null |
| Populates student and attendant details when OUT | Implemented | Uses .populate() |

---

## Bonus Features

### Pagination
| Feature | Status | Notes |
|---|---|---|
| Pagination on GET `/books` | Implemented | `?page=1&limit=10` query params |
| Total pages in response | Implemented | Calculated from total documents and limit |

---

### Search
| Feature | Status | Notes |
|---|---|---|
| Search books by title | Implemented | `?search=things` — case insensitive |
| Search books by author name | Implemented | Filters after populate |
| Search authors by name | Implemented | `?search=chinua` — uses MongoDB regex |

---

### Duplicate ISBN Prevention
| Feature | Status | Notes |
|---|---|---|
| Prevent duplicate ISBN on create | Implemented | Checked before saving, returns 400 with clear message |
| ISBN unique index in schema | Implemented | Mongoose enforces at database level |

---

### Validation Middleware
| Feature | Status | Notes |
|---|---|---|
| Validate author create | Implemented | name required |
| Validate author update | Implemented | all fields optional |
| Validate book create | Implemented | title, isbn, authors required |
| Validate book update | Implemented | all fields optional |
| Validate student create | Implemented | name, email required |
| Validate student update | Implemented | all fields optional |
| Validate attendant create | Implemented | name required |
| Validate attendant update | Implemented | all fields optional |
| Validate borrow | Implemented | studentId, attendantId, returnDate required, returnDate must be future |
| Validate register | Implemented | name, email, password, role required |
| Validate login | Implemented | email, password required |

---

### Overdue Check
| Feature | Status | Notes |
|---|---|---|
| isOverdue flag on GET `/books/:id` | Implemented | Returns true if status is OUT and returnDate has passed |
| GET `/books/overdue` endpoint | Implemented | Returns all books past their return date |

---

### Authentication (JWT)
| Feature | Status | Notes |
|---|---|---|
| User registration | Implemented | Creates User and linked Student or Attendant profile automatically |
| User login | Implemented | Returns JWT token |
| Password hashing | Implemented | bcryptjs with 10 salt rounds |
| JWT protect middleware | Implemented | Verifies token on all protected routes |
| Attendant role middleware | Implemented | Blocks students from attendant only routes |
| Student profile restriction | Implemented | Students can only update their own profile |
| Auto generate studentId | Implemented | Format STU-{timestamp} |
| Auto generate staffId | Implemented | Format ATT-{timestamp} |

---

## Extra Features

| Feature | Status | Notes |
|---|---|---|
| Swagger UI documentation | Implemented | Available at `/api-docs` |
| Database seeding | Implemented | `npm run seed` — 5 attendants, 10 students, 10 authors, 20 books |
| Global error handler | Implemented | Catches all unhandled errors, hides stack trace in production |
| MVC project structure | Implemented | models, controllers, routes, middleware, config, seeders |
| Return date shown when book is OUT | Implemented | Visible to all logged in users |
| borrowedBy and issuedBy hidden when book is IN | Implemented | Cleaned from response |

---

## Pending / Future Improvements

| Feature | Status | Notes |
|---|---|---|
| Railway deployment | ⏳ | In progress |
| Email notifications for overdue books | 🔲 | Not implemented |
| Book categories or genres | 🔲 | Not implemented |
| Student borrowing history | 🔲 | Not implemented |
| Rate limiting | 🔲 | Not implemented |