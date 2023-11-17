const WebSocket = require("ws"); 
const { saveMessage } = require("./database");

let websocketServer; 
const connectedClients = new Set(); 

const initializeWebsocketServer = (server) => {
  websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
};

const onConnection = (ws) => { 
  connectedClients.add(ws); 
  updateClientList(); 

  ws.on('close', () => { 
    connectedClients.delete(ws); 
    updateClientList(); 
    console.log("Client disconnected");
  });
  
  console.log("New websocket connection");
  ws.on("message", (message) => onMessage(ws, message)); 
};

const onMessage = (ws, message) => {
  const data = JSON.parse(message);

  const onMessage = async (ws, message) => {
    const data = JSON.parse(message);
  
    if (data.type === 'newMessage') {
      try {
        await saveMessage(data.username, data.message);
      } catch (error) {
        console.error("Fehler beim Speichern der Nachricht: ", error);
        ws.send(JSON.stringify({ type: 'error', message: 'Nachricht konnte nicht gespeichert werden.' }));
      }
    }
  };

  if (data.type === 'setUsername' || data.type === 'changeUsername') {
    ws.username = data.username || data.newUsername;
    updateClientList();
  } else {
    websocketServer.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};
 
const updateClientList = () => {
  const activeParticipants = Array.from(connectedClients).map(client => client.username || 'Anonym');

  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'activeParticipants', data: activeParticipants }));
    }
  });
};

module.exports = { initializeWebsocketServer };