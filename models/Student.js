const mongoose = require('mongoose');

// Define the Student schema
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        studentId: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true }
);

// Export the Student model
module.exports = mongoose.model('Student', studentSchema);