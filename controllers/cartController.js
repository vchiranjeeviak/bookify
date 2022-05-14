const User = require("../models/userModel");

const addBookToCart = async (req, res) => {
  if (req.user.addedBooks.includes(req.book._id)) {
    return res.status(400).json({
      message: "This book is added by you. Can't add to cart",
    });
  }
  if (req.user.cartItems.includes(req.book._id)) {
    return res.status(400).json({
      message: "This book is already in your cart",
    });
  }
  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { cartItems: [...req.user.cartItems, req.book._id] },
      { new: true }
    );
    return res.status(200).json({ cartItems: user.cartItems });
  } catch (error) {
    return res.status(200).json(error);
  }
};

const removeBookFromCart = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        cartItems: req.user.cartItems.filter(
          (book) => !book.equals(req.book._id)
        ),
      },
      { new: true }
    );
    return res.status(200).json({ cartItems: user.cartItems });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const buyCart = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { cartItems: [] },
      { new: true }
    );
    return res.status(200).json({ cartItems: user.cartItems });
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { addBookToCart, removeBookFromCart, buyCart };
