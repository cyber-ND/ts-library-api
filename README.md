# School Library Management API

A RESTful API for managing a school library system built with Node.js, Express.js and MongoDB.
Built by **Nwankpa Ndubuisi (Brainycyber)** as part of the TSAcademy Backend Development Phoenix Cohort Assignment.

---

## Tech Stack

- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB** — Database
- **Mongoose** — MongoDB object modeling
- **JWT** — Authentication
- **Bcryptjs** — Password hashing
- **Express Validator** — Request validation
- **Swagger UI** — API documentation
- **Faker.js** — Database seeding

---

## Setup Steps

### 1. Clone the repository
```bash
git clone https://github.com/cyber-ND/ts-library-api.git
cd ts-library-api
```

### 2. Install dependencies

Install production dependencies:
```bash
npm install express mongoose dotenv jsonwebtoken bcryptjs express-validator swagger-jsdoc swagger-ui-express
```

Install dev dependencies:
```bash
npm install --save-dev @faker-js/faker nodemon
```

### 3. Create your `.env` file in the root directory
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Generate a JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET` value.

### 5. Run the development server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 6. Seed the database (optional)
```bash
npm run seed
```
This will clear the database and populate it with:
- 5 attendants
- 10 students
- 10 authors
- 20 books

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Port the server runs on |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration e.g. `7d` |

---

## Authentication

This API uses JWT (JSON Web Token) authentication.

- Register and login to get a token
- Pass the token in the `Authorization` header as `Bearer <token>`
- **Attendant** role has full access to all endpoints
- **Student** role can view books, authors and attendants, borrow and return books, and update their own profile

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get JWT token |

#### POST `/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student"
}
```
Response `201`:
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Student",
  "profile": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "STU-1748392038291"
  },
  "token": "eyJhbGc..."
}
```

#### POST `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response `200`:
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Student",
  "profile": {},
  "token": "eyJhbGc..."
}
```

---

### Authors

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/authors` | Any logged in user | Get all authors |
| GET | `/authors/:id` | Any logged in user | Get a single author |
| POST | `/authors` | Attendant only | Create a new author |
| PUT | `/authors/:id` | Attendant only | Update an author |
| DELETE | `/authors/:id` | Attendant only | Delete an author |

#### GET `/authors?search=chinua`
Response `200`:
```json
{
  "message": "Authors retrieved successfully",
  "authors": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Chinua Achebe",
      "bio": "Nigerian novelist and poet",
      "createdAt": "2026-03-29T14:10:21.054Z",
      "updatedAt": "2026-03-29T14:10:21.054Z"
    }
  ]
}
```

#### POST `/authors`
```json
{
  "name": "Chinua Achebe",
  "bio": "Nigerian novelist and poet"
}
```
Response `201`:
```json
{
  "message": "Author created successfully",
  "author": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Chinua Achebe",
    "bio": "Nigerian novelist and poet",
    "createdAt": "2026-03-29T14:10:21.054Z",
    "updatedAt": "2026-03-29T14:10:21.054Z"
  }
}
```

---

### Books

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/books` | Any logged in user | Get all books with pagination and search |
| GET | `/books/:id` | Any logged in user | Get a single book |
| GET | `/books/overdue` | Attendant only | Get all overdue books |
| POST | `/books` | Attendant only | Create a new book |
| PUT | `/books/:id` | Attendant only | Update a book |
| DELETE | `/books/:id` | Attendant only | Delete a book |
| POST | `/books/:id/borrow` | Any logged in user | Borrow a book |
| POST | `/books/:id/return` | Any logged in user | Return a book |

#### GET `/books?page=1&limit=10&search=things`
Response `200`:
```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "results": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Things Fall Apart",
      "isbn": "978-0-385-47454-2",
      "authors": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Chinua Achebe"
        }
      ],
      "status": "IN",
      "createdAt": "2026-03-29T14:10:22.300Z"
    }
  ]
}
```

#### POST `/books`
```json
{
  "title": "Things Fall Apart",
  "isbn": "978-0-385-47454-2",
  "authors": ["64f1a2b3c4d5e6f7a8b9c0d1"]
}
```
Response `201`:
```json
{
  "message": "Book created successfully",
  "book": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "title": "Things Fall Apart",
    "isbn": "978-0-385-47454-2",
    "authors": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Chinua Achebe"
      }
    ],
    "status": "IN"
  }
}
```

#### POST `/books/:id/borrow`
```json
{
  "studentId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "attendantId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "returnDate": "2026-04-01"
}
```
Response `200`:
```json
{
  "message": "Book borrowed successfully",
  "book": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "title": "Things Fall Apart",
    "status": "OUT",
    "borrowedBy": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "studentId": "STU-1748392038291"
    },
    "issuedBy": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Jane Smith",
      "staffId": "ATT-1748392038292"
    },
    "returnDate": "2026-04-01T00:00:00.000Z"
  }
}
```

#### POST `/books/:id/return`
No request body needed.

Response `200`:
```json
{
  "message": "Book returned successfully",
  "book": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "title": "Things Fall Apart",
    "status": "IN",
    "borrowedBy": null,
    "issuedBy": null,
    "returnDate": null
  }
}
```

---

### Students

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/students` | Attendant only | Get all students |
| GET | `/students/:id` | Any logged in user | Get a single student |
| POST | `/students` | Attendant only | Create a new student |
| PUT | `/students/:id` | Own profile or Attendant | Update a student |
| DELETE | `/students/:id` | Attendant only | Delete a student |

#### POST `/students`
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
Response `201`:
```json
{
  "message": "Student created successfully",
  "student": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "STU-1748392038291",
    "createdAt": "2026-03-29T14:10:15.745Z"
  }
}
```

---

### Attendants

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/attendants` | Any logged in user | Get all attendants |
| GET | `/attendants/:id` | Any logged in user | Get a single attendant |
| POST | `/attendants` | Attendant only | Create a new attendant |
| PUT | `/attendants/:id` | Attendant only | Update an attendant |
| DELETE | `/attendants/:id` | Attendant only | Delete an attendant |

#### POST `/attendants`
```json
{
  "name": "Jane Smith"
}
```
Response `201`:
```json
{
  "message": "Attendant created successfully",
  "attendant": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Smith",
    "staffId": "ATT-1748392038292",
    "createdAt": "2026-03-29T14:10:13.431Z"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "message": "Error description here"
}
```

Validation errors return:
```json
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

| Status Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request or validation error |
| `401` | Not authorized, no token or token failed |
| `403` | Forbidden, insufficient permissions |
| `404` | Resource not found |
| `500` | Server error |

---

## Interactive API Docs

Swagger UI is available at:
```
http://localhost:3000/api-docs
```

---

## Live Demo
https://ts-library-api.onrender.com/api-docs/
```

**3 — Set up UptimeRobot:**
Go to [uptimerobot.com](https://uptimerobot.com), create a free account and add a monitor for:
```
https://ts-library-api.onrender.com

---

## License

ISC