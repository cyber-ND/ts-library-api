const mongoose = require('mongoose');

// Define the Book schema
// isbn = International Standard Book Number, a unique identifier for books
// authors is an array of ObjectIds referencing the Author model, allowing for multiple authors per book
// borrowedBy and issuedBy allow for one to one relationships with Student and Attendant models respectively, indicating who borrowed and issued the book
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        isbn: {
            type: String,
            unique: true,
        },
        authors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Author"
            }
        ],
        status: {
            type: String,
            enum: ["IN", "OUT"],
            default: "IN"
        },
        borrowedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            default: null
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendant",
            default: null
        },
        returnDate: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);
// Export the Book model
module.exports = mongoose.model('Book', bookSchema);