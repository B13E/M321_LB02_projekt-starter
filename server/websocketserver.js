const WebSocket = require("ws");

// Intiiate the websocket server
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
};

// If a new connection is established, the onConnection function is called
const onConnection = (ws) => {
  console.log("New websocket connection");
  ws.on("message", (message) => onMessage(ws, message));
};

// If a new message is received, the onMessage function is called

const onMessage = (ws, message) => {
  console.log("Message received: " + message);
  // Verteilen der Nachricht an alle verbundenen Clients
  websocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};


module.exports = { initializeWebsocketServer };