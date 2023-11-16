const WebSocket = require("ws"); // Original Code

let websocketServer; 
const connectedClients = new Set();

const initializeWebsocketServer = (server) => {
  websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
};


// Original Code  
const onConnection = (ws) => { // Neue verbindung mit websocket um den neuen Client zu erreichen
  connectedClients.add(ws); // Liste aller Clients
  updateClientList(); // Liste aller Clients

  ws.on('close', () => { // Liste aller Clients
    connectedClients.delete(ws); // Liste aller Clients
    updateClientList(); // Liste aller Clients
    console.log("Client disconnected");
  });
  
  console.log("New websocket connection");
  ws.on("message", (message) => onMessage(ws, message)); // Event Listener für eingehende Nachricht, nachher wird onMessage aufgerufen 
};

// Nachricht erhalten und in der Console Ausgegeben
const onMessage = (ws, message) => {
  const data = JSON.parse(message);

  if (data.type === 'setUsername' || data.type === 'changeUsername') {
    // Setzen oder Ändern des Benutzernamens
    ws.username = data.username || data.newUsername;
    updateClientList();
    // Informieren Sie alle Clients über die Namensänderung oder das Setzen des Namens
  } else {
    // Verteilen der Nachricht an alle verbundenen Clients
    websocketServer.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};
 
    // Informieren Sie alle Clients über die Namensänderung
const updateClientList = () => {
  const activeParticipants = Array.from(connectedClients).map(client => client.username || 'Anonym');

  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'activeParticipants', data: activeParticipants }));
    }
  });
};

// Original Code
module.exports = { initializeWebsocketServer };
