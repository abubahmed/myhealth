const router = require("express").Router();
let User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const jwtSecretKey = process.env.JWT_SECRET_KEY

router.route("/add").post(async (req, res) => {
  let responseSent = false;
  const { username, password, type } = req.body;
  console.log(req.body)

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser && !responseSent) {
      responseSent = true;
      return res.status(200).json({
        success: false,
        message: "Username in use",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword, type });
    await newUser.save();
    if (!responseSent) {
      const token = jwt.sign({ id: newUser._id }, jwtSecretKey, { expiresIn: "1h" });
      responseSent = true;
      res.status(200).json({
        success: true,
        message: "Signup successful",
        token,
      });
    }
  } catch (error) {
    if (!responseSent) {
      responseSent = true;
      res.status(400).json({
        success: false,
        message: "Error: " + error,
      });
    }
  }
});

router.route("/login").post(async (req, res) => {
  let responseSent = false;
  const { username, password, type } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user && !responseSent) {
      responseSent = true;
      return res.status(200).json({
        success: false,
        message: "Incorrect credentials",
        token: "",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword && user.type === type) {
      const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "1h" });
      responseSent = true;
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    }
    if (!responseSent) {
      responseSent = true;
      return res.status(200).json({
        success: false,
        message: "Incorrect credentials",
        token: "",
      });
    }
  } catch (error) {
    console.log(error);
    if (!responseSent) {
      responseSent = true;
      return res.status(400).json({
        success: false,
        message: "Error: " + error,
        token: "",
      });
    }
  }
});

module.exports = router;
