var express = require("express");
var router = express.Router();
const conn = require("../lib/MongoUtils");

var HandlerGenerator = require("../public/javascripts/handlegenerator");
var middleware = require("../public/javascripts/middleware.js");

HandlerGenerator = new HandlerGenerator();

const sendMessages = (req, res) => {
  conn
    .then((client) => {
      client
        .db("messages")
        .collection("message")
        .find({})
        .toArray((err, data) => {
          res.status(200).send(data);
          console.log(data);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const publishMessage = (req, res) => {
  conn
    .then((client) => {
      console.log(req.body);
      const newMessage = {
        author: req.body.author,
        message: req.body.message,
        ts: req.body.ts,
      };
      client
        .db("messages")
        .collection("message")
        .insertOne(newMessage)
        .then((data) => {
          res.status(200).send(newMessage);
          console.log(data);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/* GET home page. */
router.get("/", middleware.checkToken, HandlerGenerator.index);
router.get("/msgs", middleware.checkToken, sendMessages);
router.post("/msgs", middleware.checkToken, publishMessage);

router.post("/login", HandlerGenerator.login);

module.exports = router;
