const mongoose = require('mongoose');

// Define the library attendant schema
const attendantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        staffId: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);
// Export the Attendant model
module.exports = mongoose.model('Attendant', attendantSchema);