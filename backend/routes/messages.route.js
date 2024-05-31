const router = require("express").Router();
let Message = require("../models/message.model");
let User = require("../models/user.model");
const verifyToken = require("../util/verifyToken");

router.route("/get").get(verifyToken, async (req, res) => {
  let responseSent = false;
  const username = req.user?.username;

  try {
    const messages = await Message.find({
      $or: [{ receiver: username }, { sender: username }],
    });
    if (!responseSent) {
      responseSent = true;
      return res.status(200).json({
        success: true,
        message: "Messages successfully retrieved",
        data: messages,
      });
    }
  } catch (error) {
    if (!responseSent) {
      responseSent = true;
      return res.status(400).json({
        success: false,
        message: "Error: " + error,
        data: null,
      });
    }
  }
});

router.route("/send").post(verifyToken, async (req, res) => {
  let responseSent = false;
  const { receiver, message, subject, date } = req.body;
  const username = req.user?.username;
  console.log(req.body);

  try {
    const senderUser = await User.findOne({ username: username });
    const receiverUser = await User.findOne({ username: receiver });
    if (!senderUser || !receiverUser) {
      console.log(senderUser, receiverUser);
      if (!responseSent) {
        responseSent = true;
        return res.status(200).json({
          success: true,
          message: "Failed to find sender or receiver",
        });
      }
    }
    const senderType = senderUser.type;
    const receiverType = receiverUser.type;
    if (senderType === receiverType) {
      if (!responseSent) {
        responseSent = true;
        return res.status(200).json({
          success: true,
          message: "Cannot send message to user of same type",
        });
      }
    }
    const newMessage = new Message({ sender: username, receiver, subject, message, date });
    await newMessage.save();
    if (!responseSent) {
      responseSent = true;
      return res.status(200).json({
        success: true,
        message: "Message successfully sent",
      });
    }
  } catch (error) {
    console.log(error);
    if (!responseSent) {
      responseSent = true;
      return res.status(400).json({
        success: false,
        message: "Error: " + error,
      });
    }
  }
});

module.exports = router;
