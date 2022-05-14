const Book = require("../models/bookModel");

const getBookById = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(400).json({
      message: "Book not found",
    });
  }
  req.book = book;
  next();
};

module.exports = {
  getBookById,
};
