const User = require("../models/userModel");
const Book = require("../models/bookModel");

const getProfile = async (req, res) => {
  if (!req.user._id.equals(req.profile._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }
  try {
    let profile = await User.findById(req.user._id).select("-password");
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getMyBooks = async (req, res) => {
  if (!req.user._id.equals(req.profile._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }
  try {
    let profile = await User.findById(req.user._id).select("-password");
    let books = [];
    profile.addedBooks.forEach((book) => {
      Book.findById(book, (err, bookD) => {
        books.append(bookD);
      });
    });
    return res.status(200).json({
      books: books,
    });
  } catch (error) {}
};
const updateProfile = async (req, res) => {
  if (!req.user._id.equals(req.profile._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }
  try {
    let profile = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteProfile = async (req, res) => {
  if (!req.user._id.equals(req.profile._id)) {
    return res.status(400).json({
      message: "You are not authorized",
    });
  }

  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).json(err);
    }
    user.password = undefined;
    user.addedBooks.forEach((book) =>
      Book.findByIdAndDelete(book, (err, book) => {
        if (err) {
          return res.status(400).json(err);
        }
      })
    );
    return res.status(200).json(user);
  });
};

module.exports = {
  getProfile,
  getMyBooks,
  updateProfile,
  deleteProfile,
};
