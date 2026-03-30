const Author = require('../models/Author');

const createAuthor = async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json({ message: "Author created successfully", author });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllAuthors = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const authors = await Author.find(query);
    res.status(200).json({ message: "Authors retrieved successfully", authors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        res.status(200).json({ message: "Author retrieved successfully", author });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        res.status(200).json({ message: "Author updated successfully", author });
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

const deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        res.status(200).json({ message: "Author deleted successfully", author });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
};
