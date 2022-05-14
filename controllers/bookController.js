const Book = require("../models/bookModel");
const User = require("../models/userModel");

const getAllBooks = async (req, res) => {
  let books = await Book.find({});
  return res.status(200).json({ books: books });
};
// GET api/book/:id
const getBook = async (req, res) => {
  let book = req.book;
  return res.status(200).json(book);
};

// POST api/book
const addBook = async (req, res) => {
  const { name, price, description, image } = req.body;
  if ((!name, !price, !image)) {
    return res.status(400).json({
      message: "Enter all required data",
    });
  }

  let book;
  try {
    book = await Book.create({
      name,
      price,
      description,
      image,
    });
    await User.findByIdAndUpdate(
      req.user._id,
      { addedBooks: [...req.user.addedBooks, book._id] },
      { new: true }
    );
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Could not add book",
      error,
    });
  }
};

// PUT api/book/:id
const updateBook = async (req, res) => {
  if (!req.user.addedBooks.includes(req.book._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }
  try {
    let book = await Book.findByIdAndUpdate(req.book._id, req.body, {
      new: true,
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// DEL api/book/:id
const deleteBook = async (req, res) => {
  if (!req.user.addedBooks.includes(req.book._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        addedBooks: req.user.addedBooks.filter(
          (book) => !book.equals(req.book._id)
        ),
      },
      { new: true }
    );
    await Book.findByIdAndDelete(req.book._id);
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Couldn't delete" });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
};
