const Attendant = require('../models/Attendant');

const createAttendant = async (req, res) => {
    try {
        const attendant = await Attendant.create(req.body); 
        res.status(201).json({ message: "Attendant created successfully", attendant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
const getAllAttendants = async (req, res) => {
    try {
        const attendants = await Attendant.find();
        res.status(200).json({ message: "Attendants retrieved successfully", attendants });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
const getAttendantById = async (req, res) => {
    try {
        const attendant = await Attendant.findById(req.params.id);
        if (!attendant) {
            return res.status(404).json({ message: "Attendant not found" });
        }
        res.status(200).json({ message: "Attendant retrieved successfully", attendant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAttendant = async (req, res) => {
    try {
        const attendant = await Attendant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attendant) {
            return res.status(404).json({ message: "Attendant not found" });
        }
        res.status(200).json({ message: "Attendant updated successfully", attendant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAttendant = async (req, res) => {
    try {
        const attendant = await Attendant.findByIdAndDelete(req.params.id);
        if (!attendant) {
            return res.status(404).json({ message: "Attendant not found" });
        }
        res.status(200).json({ message: "Attendant deleted successfully", attendant });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createAttendant,
    getAllAttendants,
    getAttendantById,
    updateAttendant,
    deleteAttendant
};
