const WebSocket = require("ws");

let websocketServer; // Deklarieren Sie websocketServer auf einer höheren Ebene

const initializeWebsocketServer = (server) => {
  websocketServer = new WebSocket.Server({ server }); // Zuweisung hier
  websocketServer.on("connection", onConnection);
};

const onConnection = (ws) => {
  console.log("New websocket connection");
  ws.on("message", (message) => onMessage(ws, message));
};

const onMessage = (ws, message) => {
  console.log("Message received: " + message);
  // Verteilen der Nachricht an alle verbundenen Clients
  websocketServer.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

module.exports = { initializeWebsocketServer };
