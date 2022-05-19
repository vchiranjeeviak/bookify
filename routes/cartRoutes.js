const express = require("express");
const router = express.Router();
const {
  addBookToCart,
  removeBookFromCart,
  buyCart,
} = require("../controllers/cartController");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

const { getBookById } = require("../middlewares/bookMiddlewares");

router.param("id", getBookById);

router.post("/:id", isLoggedIn, addBookToCart);
router.put("/:id", isLoggedIn, removeBookFromCart);
router.put("/buy", isLoggedIn, buyCart);

module.exports = router;
