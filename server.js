require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// Connect to MongoDB
dbConnect();

app.use(express.json());

// swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import and use routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/books", require("./routes/bookRoutes"));
app.use("/authors", require("./routes/authorRoutes"));
app.use("/students", require("./routes/studentRoutes"));
app.use("/attendants", require("./routes/attendantRoutes"));

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});