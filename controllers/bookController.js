require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const fspromises = require("fs/promises");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

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
  const { name, price, description } = req.body;
  const upload_path = "/app" + "/temp_media/" + req.files.image.name;
  await req.files.image.mv(upload_path);
  if ((!name, !price, !req.files.image)) {
    return res.status(400).json({
      message: "Enter all required data",
    });
  }
  let image_url;
  try {
    const image_res = await cloudinary.uploader.upload(upload_path);
    image_url = image_res.secure_url;
    image_cloud_name = image_res.public_id;
    await fspromises.unlink(upload_path);
  } catch (error) {
    return res.status(400).json({
      message: "Image upload error",
    });
  }
  let book;
  try {
    book = await Book.create({
      name,
      price,
      description,
      image: image_url,
      cloud_book_name: image_cloud_name,
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
    await cloudinary.uploader.destroy(req.book.cloud_book_name);
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
