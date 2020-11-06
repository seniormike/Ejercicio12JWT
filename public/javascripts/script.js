const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMsg(JSON.parse(msg.data));
};

const renderMsg = (data) => {
  const html = data.map((item) => `<p>${item.author}: ${item.message}  - (TimeStamp: ${item.ts} )</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  ws.send(message.value + "::" + author.value);
  message.value = "";
  author.value = "";
};
const form = document.getElementById("frm");
form.addEventListener("submit", handleSubmit);