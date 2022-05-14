const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(500).json({
      message: "Enter valid credentials",
    });
  }

  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(password, salt);

  try {
    let user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      id: user._id,
      name,
      email,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
};

const signin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      message: "Enter valid credentials",
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.json(500).json({
        message: "User not found",
      });
    }

    if (user == null) {
      return res.status(400).json({
        message: "No such user exists",
      });
    }

    const verified = bcrypt.compareSync(password, user.password);

    if (verified) {
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    }

    return res.status(500).json({
      message: "Password incorrect",
    });
  });
};

module.exports = { signup, signin };
