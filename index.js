const express = require("express");
require("dotenv").config();
const connectdb = require("./config/database");
const cors = require("cors");

connectdb();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const profileRoutes = require("./routes/profileRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/book", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
