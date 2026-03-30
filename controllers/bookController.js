const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // fetch all books with populate first then filter
    const books = await Book.find()
      .populate("authors")
      .populate("borrowedBy")
      .populate("issuedBy")
      .skip(skip)
      .limit(limit);

    // filter by title or author name after populate
    let results = books;
    if (search) {
      results = books.filter((book) => {
        const titleMatch = book.title.match(new RegExp(search, "i"));
        const authorMatch = book.authors.some((a) =>
          a.name.match(new RegExp(search, "i"))
        );
        return titleMatch || authorMatch;
      });
    }

    const total = search ? results.length : await Book.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
    try {
        // Find the book by ID and populate related fields (authors, borrowedBy, issuedBy)
        const book = await Book.findById(req.params.id)
            .populate("authors")
            .populate("borrowedBy")
            .populate("issuedBy");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Determine if the book is overdue based on its status and return date
        const isOverdue =
            book.status === "OUT" &&
            book.returnDate &&
            // Check if the current date is past the return date to determine if the book is overdue
            new Date() > new Date(book.returnDate);

        const response = book.toObject();

        // only include borrowedBy, issuedBy, returnDate if OUT
        if (book.status === "IN") {
            delete response.borrowedBy; // Remove borrowedBy field if the book is available
            delete response.issuedBy; // Remove issuedBy field if the book is available
            delete response.returnDate; // Remove returnDate field if the book is available
        }

        // Return the book details along with an isOverdue flag if the book is currently checked out
        res.status(200).json({ ...response, isOverdue: isOverdue || false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBook = async (req, res) => {
  try {
    if (req.body.isbn) {
      const existing = await Book.findOne({ isbn: req.body.isbn });
      if (existing) {
        return res.status(400).json({ message: "A book with this ISBN already exists" });
      }
    }
    const book = await Book.create(req.body);
    
    // populate authors after create
    await book.populate("authors");
    
    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("authors")
      .populate("borrowedBy")
      .populate("issuedBy");
      
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
    try {
        // Find the book by ID and delete it, returning the deleted book in the response
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully", book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const  borrowBook = async (req, res) => {
    try {
        const  { studentId, attendantId, returnDate } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.status === "OUT") {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        // Update the book's status to "OUT", set the borrowedBy field to the student's ID, set the issuedBy field to the attendant's ID, and set the returnDate field to the provided return date
        book.status = "OUT";
        book.borrowedBy = studentId;
        book.issuedBy = attendantId;
        book.returnDate = returnDate;
        await book.save();

        // Populate the authors, borrowedBy, and issuedBy fields of the book before returning it in the response to provide complete information about the book and its borrowing details
        await book.populate("authors borrowedBy issuedBy");
        res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.status === "IN") {
      return res.status(400).json({ message: "Book is not currently borrowed" });
    }

    book.status = "IN";
    book.borrowedBy = null;
    book.issuedBy = null;
    book.returnDate = null;
    await book.save();

    // populate authors after save
    await book.populate("authors");

    res.status(200).json({ message: "Book returned successfully", book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOverdueBooks = async (req, res) => {
    try {
        const overdueBooks = await Book.find({
            // Find books that are currently checked out (status: "OUT") and have a return date that is in the past (returnDate < current date) to identify overdue books
            status: "OUT",
            returnDate: { $lt: new Date() } // Find books that are currently checked out and have a return date in the past
        }).populate("authors borrowedBy issuedBy"); // Populate related fields to provide complete information about the overdue books
        // Return the total number of overdue books and the list of overdue books in the response
        res.status(200).json({ total: overdueBooks.length, overdueBooks });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getOverdueBooks
};









