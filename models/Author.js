const mongoose = require('mongoose');

// Define the Author schema
const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        }
    },
    { timestamps: true }
);
// Export the Author model
module.exports = mongoose.model('Author', authorSchema);
