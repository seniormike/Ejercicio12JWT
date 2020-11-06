const messageController = require("./controllers/message");
const WebSocket = require("ws");
const fs = require("fs");
const clients = [];
const messages = messageController.wsGetMessages;
const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws) => {
    //clients.push(ws);
    //sendMessages();
    ws.on("message", (message) => {
        messageController.wsCreateMessage(
          { message: message.split("::")[0], author: message.split("::")[1]}
        );
      this.messages = messageController.wsGetMessages;
    });
  });
  const sendMessages = () => {
    clients.forEach(
      (client) => client.send(JSON.stringify(messages))
    );
  };
};
exports.wsConnection = wsConnection;