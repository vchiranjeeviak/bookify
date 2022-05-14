const express = require("express");
const router = express.Router();

const {
  getProfile,
  getMyBooks,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

const { isLoggedIn } = require("../middlewares/authMiddlewares");
const { getUserById } = require("../middlewares/profileMiddlewares");

router.param("userid", getUserById);

router.get("/:userid", isLoggedIn, getProfile);
router.get("/books/:userid", isLoggedIn, getMyBooks);
router.put("/:userid", isLoggedIn, updateProfile);
router.delete("/:userid", isLoggedIn, deleteProfile);

module.exports = router;
