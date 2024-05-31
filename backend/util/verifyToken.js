const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const User = require("../models/user.model");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtSecretKey, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const foundUser = await User.findById(user.id);
      req.user = foundUser;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyToken;