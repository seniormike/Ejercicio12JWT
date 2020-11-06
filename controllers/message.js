/**
 * Imports
 */
const fs = require("fs");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3000");
const { messageValidation } = require("../models/message");
const conn = require("../lib/MongoUtils");

/**
 * Messages array
 */
let messages = [].concat(JSON.parse(fs.readFileSync("./messagesArray.json")));

/**
 * Method that generates a message body based on the parameters.
 */
const makeMessage = (message) => {
  let msgNew = {
    message: message.message,
    author: message.author,
    ts: new Date().getTime(),
  };
  return msgNew;
};

/**
 * Method that updates the jsonfile based on the messages array.
 */
const save = () => {
  fs.writeFileSync("./messagesArray.json", JSON.stringify(messages));
};

/**
 * Method that add a message to the array.
 * @param {message} message
 */
const pushMessage = (message) => {
  const newMessage = makeMessage(message);
  messages.push(newMessage);
  conn
    .then((client) => {
      client
        .db("messages")
        .collection("message")
        .insertOne(newMessage)
        .then((data) => {
          console.log(data);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  save();
  return messages;
};

exports.wsGetMessages = messages;
exports.wsCreateMessage = pushMessage;

/**
 * Method that gets all messages in the database.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
exports.getAllMessages = (req, res, next) => {
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
  //res.status(200).send(messages);
};

/**
 * Method that validates, creates and saves a message with the given information.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
exports.createMessage = (req, res, next) => {
  const { error } = messageValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  pushMessage(req.body);

  conn
    .then((client) => {
      const newMessage = makeMessage(req.body);
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

  //res.status(200).send(messages);
  //Update
  ws.send("");
};

/**
 * Method that gets a message with the given id or timestamp.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
exports.getMessageById = (req, res, next) => {
  const id = parseInt(req.params.ts);
  conn
    .then((client) => {
      client
        .db("messages")
        .collection("message")
        .findOne({ ts: id })
        .then((data) => {
          res.status(200).send(data);
          console.log(data);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/**
 * Method that deletes a message with the given id or timestamp.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
exports.deleteMessage = (req, res, next) => {
  const id = parseInt(req.params.ts);
  conn
    .then((client) => {
      client
        .db("messages")
        .collection("message")
        .deleteOne({ ts: id })
        .then((data) => {
          res.status(200).send(data);
          console.log(data);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });

  //res.status(200).send(messages);
  //Update
  ws.send("");
};

/**
 * Method that updates a message with the given information.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
exports.updateMessage = (req, res, next) => {
  const { error } = messageValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  const id = parseInt(req.body.ts);
  console.log(id);
  conn
    .then((client) => {
      const newMessage = makeMessage(req.body);
      newMessage.ts = id;
      client
        .db("messages")
        .collection("message")
        .updateOne(
          { ts: id },
          { $set: { message: newMessage.message, author: newMessage.author } }
        )
        .then((data) => {
          res.status(200).send(newMessage);
          console.log(data);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });

  //res.status(200).send(messages);
  //Update
  ws.send("");
};
