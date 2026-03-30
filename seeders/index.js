require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const seedAttendants = require("./attendantSeeder");
const seedStudents = require("./studentSeeder");
const seedAuthors = require("./authorSeeder");
const seedBooks = require("./bookSeeder");

const User = require("../models/User");
const Student = require("../models/Student");
const Attendant = require("../models/Attendant");
const Author = require("../models/Author");
const Book = require("../models/Book");

const seed = async () => {
  try {
    await connectDB();

    // clear all collections first
    console.log("🗑️  Clearing database...");
    await User.deleteMany();
    await Student.deleteMany();
    await Attendant.deleteMany();
    await Author.deleteMany();
    await Book.deleteMany();
    console.log("Database cleared");

    // seed in order
    await seedAttendants();
    await seedStudents();
    await seedAuthors();
    await seedBooks();

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();