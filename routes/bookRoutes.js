const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { getBookById } = require("../middlewares/bookMiddlewares");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

router.param("id", getBookById);

router.get("/", getAllBooks);
router.get("/:id", getBook);
router.post("/", isLoggedIn, addBook);
router.put("/:id", isLoggedIn, updateBook);
router.delete("/:id", isLoggedIn, deleteBook);

module.exports = router;
