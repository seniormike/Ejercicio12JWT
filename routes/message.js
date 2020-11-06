const express = require("express");
const messageController = require("../controllers/message");
const router = express.Router();
router.route("/")
  .post(messageController.createMessage)
  .get(messageController.getAllMessages)
  .put(messageController.updateMessage);
router.route("/:ts")
  .get(messageController.getMessageById)
  .delete(messageController.deleteMessage);
module.exports = router;